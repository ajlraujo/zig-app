import { useState, useEffect } from 'react';
import { Alert, ScrollView, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Button, Card, IconButton, Dialog, Portal, Provider, Text, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

export default function AddEventScreen() {
	const [image, setImage] = useState<string[]>([]);
	const [title, setTitle] = useState('');
	const [startDate, setStartDate] = useState((new Date()));
	const [endDate, setEndDate] = useState((new Date(startDate.getTime() + 60 * 60 * 1000)));
	const [showPicker, setShowPicker] = useState({ active: false, type: null });
	const [location, setLocation] = useState('');
	const [description, setDescription] = useState('');
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const [visible, setVisible] = useState(false);
	const [dialogType, setDialogType] = useState<'title' | 'location' | 'description' | null>(null);

	useEffect(() => {
		(async () => {
			const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
			setHasPermission(status === 'granted');
		})();
	}, []);

	const pickImage = async () => {
		if (hasPermission === false) {
			Alert.alert('Permissão negada', 'Você precisa permitir o acesso à galeria nas configurações.');
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsMultipleSelection: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	const removeImage = (index: number) => {
		setImage(null);
	};

	const onChange = (event, selectedDate) => {
		if (event.type === 'dismissed' || selectedDate === undefined) {
			setShowPicker({ active: false, type: null });
			return
		}
		if (showPicker.type === 'start') {
			setStartDate(selectedDate);
		} else if (showPicker.type === 'end') {
			setEndDate(selectedDate);
		}
		setShowPicker({ active: false, type: null });
	};

	const showDatePicker = (type) => {
		setShowPicker({ active: true, type });
	};

	const formatDate = (date) => date.toLocaleString();

	const showDialog = (type) => {
		setDialogType(type);
		setVisible(true);
	};

	const hideDialog = () => {
		setDialogType(null);
		setVisible(false);
	};

	const getValue = () => {
		switch (dialogType) {
			case 'title':
				return title || '';
			case 'location':
				return location || '';
			case 'description':
				return description || '';
			default:
				return '';
		}
	};

	const setValue = (text) => {
		switch (dialogType) {
			case 'title':
				setTitle(text);
				break;
			case 'location':
				setLocation(text);
				break;
			case 'description':
				setDescription(text);
				break;
			default:
				break;
		}
	};

	return (
		<Provider>
			<ScrollView style={styles.container}>
				<Text style={styles.title}>Criar rolê</Text>

				<View style={styles.imageContainer}>
					<TouchableOpacity onPress={pickImage} style={{ position: 'relative' }}>
						<View style={styles.imageWrapper}>
							{image ? <Image source={{ uri: image }} style={styles.image} /> : <Text>Adicionar Imagem</Text>}
						</View>
						<IconButton icon="image-plus" size={18} style={styles.addButton} iconColor="white" />
					</TouchableOpacity>
				</View>

				<TouchableOpacity onPress={() => showDialog('title')} style={styles.titleButton}>
					<Text style={styles.titleText}>{title || 'Adicionar Título'}</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.touchableButton}>
					<View style={styles.buttonContent}>
						<IconButton icon="clock" size={18} style={styles.icon} />
						<Text style={styles.buttonText}>Início:</Text>
						<DateTimePicker
							value={startDate}
							mode="datetime"
							display="default"
							onChange={(event, selectedDate) => {
								if (selectedDate) setStartDate(selectedDate);
							}}
							style={{ flex: 1 }}
						/>
					</View>
				</TouchableOpacity>

				<TouchableOpacity style={styles.touchableButton}>
					<View style={styles.buttonContent}>
						<IconButton icon="clock-outline" size={18} style={styles.icon} />
						<Text style={styles.buttonText}>Fim:</Text>
						<DateTimePicker
							value={endDate}
							mode="datetime"
							display="default"
							onChange={(event, selectedDate) => {
								if (selectedDate) setEndDate(selectedDate);
							}}
							style={{ flex: 1 }}
						/>
					</View>
				</TouchableOpacity>

				{showPicker.active && (
					<DateTimePicker
						value={showPicker.type === 'start' ? startDate : endDate}
						mode="datetime"
						display="default"
						onChange={onChange}
					/>
				)}

				<TouchableOpacity style={styles.touchableButton} onPress={() => showDialog('location')}>
					<View style={styles.buttonContent}>
						<IconButton icon="map-marker" size={20} style={styles.icon} />
						<Text style={styles.buttonText}>{location || 'Adicionar Localização'}</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity style={styles.touchableButton} onPress={() => showDialog('description')}>
					<View style={styles.buttonContent}>
						<IconButton icon="file-document" size={20} style={styles.icon} />
						<Text style={styles.buttonText}>{description || 'Adicionar Descrição'}</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity style={styles.createButton}>
					<Text style={styles.createButtonText}>Criar Rolê</Text>
				</TouchableOpacity>

				<Portal>
					<Dialog visible={visible} onDismiss={() => hideDialog}>
						<Dialog.Title>
							{dialogType === 'title' ? 'Editar título' :
								dialogType === 'location' ? 'Adicionar local' :
									'Adicionar Descrição'}
						</Dialog.Title>
						<Dialog.Content>
							<TextInput
								placeholder={
									dialogType === 'title' ? 'Digite o título' :
										dialogType === 'location' ? 'Digite o local' :
											'Digite a descrição'}
								value={getValue()}
								onChangeText={setValue}
							/>
						</Dialog.Content>

						<Dialog.Actions>
							<Button onPress={hideDialog}>Cancelar</Button>
							<Button onPress={hideDialog}>Salvar</Button>
						</Dialog.Actions>

					</Dialog>
				</Portal>
			</ScrollView >
		</Provider>
	);
};

export const styles = StyleSheet.create({
	container: {
		padding: 20,
	},
	title: {
		fontSize: 18.75,
		marginVertical: 20,
		textAlign: 'center',
		color: "#242424",
		fontWeight: 'medium',
		fontFamily: 'sans-serif',
	},
	imageContainer: {
		flex: 1,
		alignItems: "center",
		marginBottom: 15,
	},
	imageWrapper: {
		width: 200,
		height: 200,
		borderRadius: 15,
		backgroundColor: "#e0e0e0",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
	},
	image: {
		width: 200,
		height: 200,
		borderRadius: 10,
	},
	addButton: {
		position: "absolute",
		bottom: 5,
		right: 5,
		backgroundColor: "rgba(0,0,0,0.5)",
		borderRadius: 20,
	},
	titleText: {
		fontSize: 23.44,
		fontWeight: "bold",
		color: "#B0B0B0",
	},
	bodyText: {
		fontSize: 18.75,
		fontWeight: "regular",
		color: "#B0B0B0",
	},
	touchableButton: {
		backgroundColor: '#ffffff',
		borderRadius: 10,
		marginTop: 10,
		alignSelf: 'stretch',
		minHeight: 42,
		justifyContent: 'center',
		paddingHorizontal: 15,
		alignItems: 'flex-start',
	},
	titleButton: {
		backgroundColor: '#ffffff',
		borderRadius: 10,
		marginTop: 10,
		alignSelf: 'stretch',
		minHeight: 50,
		justifyContent: 'center',
		paddingHorizontal: 15,
		alignItems: 'flex-start',
	},
	createButton: {
		marginTop: 50,
		backgroundColor: '#6200ee',
		borderRadius: 25,
		alignSelf: 'stretch',
		minHeight: 50,
		justifyContent: 'center',
		alignItems: 'center',
	},
	createButtonText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#ffffff',
	},
	buttonContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	icon: {
		marginRight: 5,
		marginLeft: -8,
	},
	buttonText: {
		fontSize: 18,
		color: '#B0B0B0',
	},
});