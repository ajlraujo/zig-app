import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Button, Card } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function AddActvityScreen() {
	const [title, setTitle] = useState('');
	const [location, setLocation] = useState('');
	const [description, setDescription] = useState('');

	return (
		<ScrollView style={{ padding: 20 }}>
			<Text style={{ fontSize: 24, marginBottom: 10 }}>Novo Rolê</Text>

			<TextInput
				placeholder="Título"
				value={title}
				onChangeText={setTitle}
				style={{ borderBottomWidth: 1, marginBottom: 20 }}
			/>

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