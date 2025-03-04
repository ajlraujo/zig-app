import { useState, useEffect } from 'react';
import { Alert, ScrollView, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Button, Card, IconButton, Dialog, Portal, Provider, Text, TextInput, Appbar } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

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
	const [tempValue, setTempValue] = useState('');

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

	const showDialog = (type) => {
		setDialogType(type);
		setTempValue(getValue());
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

	const saveDialogValue = () => {
		if (dialogType === 'title') {
			setTitle(tempValue);
		} else if (dialogType === 'location') {
			setLocation(tempValue);
		} else if (dialogType === 'description') {
			setDescription(tempValue);
		}
		hideDialog();
	};

	return (
		<Provider>
			<View style={styles.header}>
				<Appbar.Header style={styles.appBar}>
					<Appbar.Action icon="close" iconColor='#707070' onPress={() => console.log('Cancelar')} />
					<Appbar.Content title="Criar Rolê" titleStyle={styles.headerTitle} />
					<Appbar.Action icon="check" iconColor='#707070' onPress={() => console.log('Publicar')} />
				</Appbar.Header>
			</View>

			<LinearGradient
				colors={['#EEEED4', '#FFFFFF']}
				style={styles.gradientBackground}
			>
				<ScrollView style={styles.container}>

					<View style={styles.imageContainer}>
						<TouchableOpacity onPress={pickImage} style={{ position: 'relative' }}>
							<View style={styles.imageWrapper}>
								{image ? <Image source={{ uri: image }} style={styles.image} /> : <Text>Adicionar Imagem</Text>}
							</View>
							<IconButton icon="image-plus" size={18} style={styles.addButton} iconColor="#212121" />
						</TouchableOpacity>
					</View>

					<TouchableOpacity onPress={() => showDialog('title')} style={styles.titleButton}>
						<Text style={[styles.titleText, { color: title ? '#707070' : '#B0B0B0' }]}>
							{title || 'Adicionar Título'}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.touchableButton}>
						<View style={styles.buttonContent}>
							<IconButton icon="clock" iconColor='#707070' size={18} style={styles.icon} />
							<Text style={styles.buttonText}>Início:</Text>
							<DateTimePicker
								value={startDate}
								mode="datetime"
								display="default"
								themeVariant="light"
								onChange={(event, selectedDate) => {
									if (selectedDate) setStartDate(selectedDate);
								}}
								style={{ flex: 1 }}
							/>
						</View>
					</TouchableOpacity>

					<TouchableOpacity style={styles.touchableButton}>
						<View style={styles.buttonContent}>
							<IconButton icon="clock-outline" iconColor='#707070' size={18} style={styles.icon} />
							<Text style={styles.buttonText}>Fim:</Text>
							<DateTimePicker
								value={endDate}
								mode="datetime"
								display="default"
								themeVariant="light"
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
							<IconButton icon="map-marker" iconColor={location ? '#707070' : '#B0B0B0'} size={20} style={styles.icon} />
							<Text style={[styles.buttonText, { color: location ? '#707070' : '#B0B0B0' }]}>
								{location || 'Adicionar Localização'}
							</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity style={styles.touchableButton} onPress={() => showDialog('description')}>
						<View style={styles.buttonContent}>
							<IconButton icon="file-document" iconColor={description ? '#707070' : '#B0B0B0'} size={20} style={styles.icon} />
							<Text style={[styles.buttonText, { color: description ? '#707070' : '#B0B0B0' }]}>
								{description || 'Adicionar Descrição'}
							</Text>
						</View>
					</TouchableOpacity>

					<Portal>
						<Dialog visible={visible} onDismiss={hideDialog}>
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
									value={tempValue}
									onChangeText={(text) => setTempValue(text)}
								/>
							</Dialog.Content>

							<Dialog.Actions>
								<Button onPress={hideDialog}>Cancelar</Button>
								<Button onPress={() => { saveDialogValue(); hideDialog(); }}>Salvar</Button>
							</Dialog.Actions>

						</Dialog>
					</Portal>
				</ScrollView >
			</LinearGradient>
		</Provider >
	);
};

export const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 10,
	},
	appBar: {
		backgroundColor: '#EEEED4',
		elevation: 0.8,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		color: "#242424",
	},
	gradientBackground: {
		flex: 1,
	},
	container: {
		padding: 20,
	},
	imageContainer: {
		flex: 1,
		alignItems: "center",
		marginBottom: 20,
		marginTop: 80,
	},
	imageWrapper: {
		width: 200,
		height: 200,
		borderRadius: 15,
		backgroundColor: 'rgba(201, 201, 201, 0.3)',
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
		backgroundColor: 'rgba(201, 201, 201, 0.3)',
		borderRadius: 20,
	},
	titleText: {
		fontSize: 23.44,
		fontWeight: "bold",
		color: "#B0B0B0",
	},
	touchableButton: {
		backgroundColor: 'rgba(201, 201, 201, 0.3)',
		borderRadius: 10,
		marginTop: 15,
		alignSelf: 'stretch',
		minHeight: 42,
		justifyContent: 'center',
		paddingHorizontal: 15,
		alignItems: 'flex-start',
	},
	titleButton: {
		backgroundColor: 'rgba(201, 201, 201, 0.3)',
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
		backgroundColor: '#242424',
		borderRadius: 25,
		alignSelf: 'stretch',
		minHeight: 50,
		justifyContent: 'center',
		alignItems: 'center',
	},
	createButtonText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#f1f1f1',
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
		color: '#707070',
	},
});