import { useState, useEffect } from 'react';
import { Alert, ScrollView } from "react-native";
import { Button, Card, IconButton, Dialog, Portal, Provider, Text, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

export default function AddEventScreen() {
	const [images, setImages] = useState<string[]>([]);
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
			setImages((prevImages) => [...prevImages, ...result.assets.map((asset) => asset.uri)]);
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
		<ScrollView style={{ padding: 20 }}>
			<Text style={{ fontSize: 24, marginBottom: 10 }}>Novo Rolê</Text>

			{images.map((uri, index) => (
				<Card key={index}>
					<Card.Cover source={{ uri }} />
				</Card>
			))}

			<IconButton icon="image-plus" size={24} onPress={pickImage} />

			<Button mode="outlined" onPress={() => showDialog('title')}>
				{title || 'Adicionar Título'}
			</Button>

			<Button mode="outlined" onPress={() => showDatePicker('start')} style={{ marginTop: 10 }}>
				Começo: {formatDate(startDate)}
			</Button>

			<Button mode="outlined" onPress={() => showDatePicker('end')} style={{ marginTop: 10 }}>
				Fim: {formatDate(endDate)}
			</Button>

			{showPicker.active && (
				<DateTimePicker
					value={showPicker.type === 'start' ? startDate : endDate}
					mode="datetime"
					display="default"
					onChange={onChange}
				/>
			)}

			<Button icon="map-marker" mode="outlined" onPress={() => showDialog('location')} style={{ marginTop: 10 }}>
				{location || 'Adicionar Localização'}
			</Button>

			<Button icon="file-document" mode="outlined" onPress={() => showDialog('description')} style={{ marginTop: 10 }}>
				{description || 'Adicionar Descrição'}
			</Button>

			<Button mode="contained" style={{ marginTop: 10 }}>
				Criar Rolê
			</Button>

			<Dialog visible={visible} onDismiss={() => setVisible}>
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

		</ScrollView>
	);
};