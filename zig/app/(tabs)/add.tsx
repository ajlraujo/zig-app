import { useState, useEffect } from 'react';
import { Alert, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Button, Card, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

export default function AddEventScreen() {
	const [images, setImages] = useState<string[]>([]);
	const [title, setTitle] = useState('');
	const [startDate, setStartDate] = useState((new Date()));
	const [endDate, setEndDate] = useState((new Date(startDate.getTime() + 60 * 60 * 1000)));
	const [showPicker, setShowPicker] = useState({ active: false, type: null });
	const [capacity, setCapacity] = useState('');
	const [location, setLocation] = useState('');
	const [description, setDescription] = useState('');
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);

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
			setImages((prevImages) => [
				...prevImages,
				...result.assets.map((asset) => asset.uri),
			]);
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

	return (
		<ScrollView style={{ padding: 20 }}>
			<Text style={{ fontSize: 24, marginBottom: 10 }}>Novo Rolê</Text>

			{images.map((uri, index) => (
				<Card key={index}>
					<Card.Cover source={{ uri }} />
				</Card>
			))}

			<IconButton icon="image-plus" size={24} onPress={pickImage} />

			<TextInput
				placeholder="Título"
				value={title}
				onChangeText={setTitle}
				style={{ borderBottomWidth: 1, marginBottom: 20, marginTop: 20 }}
			/>

			<Button mode="outlined" onPress={() => showDatePicker('start')}>
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

			<Button icon="map-marker" mode="outlined" onPress={() => { }} style={{ marginTop: 10 }}>
				Adicionar Local
			</Button>

			<Button icon="file-document" mode="outlined" onPress={() => { }} style={{ marginTop: 10 }}>
				Adicionar Descrição
			</Button>

			<Button mode="contained" style={{ marginTop: 10 }}>
				Criar Rolê
			</Button>

		</ScrollView>
	);
};