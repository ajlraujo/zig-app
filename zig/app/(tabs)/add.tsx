import { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Button, Card } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddEventScreen() {
	const [title, setTitle] = useState('');
	const [startDate, setStartDate] = useState((new Date()));
	const [endDate, setEndDate] = useState((new Date()));
	const [showPicker, setShowPicker] = useState({ active: false, type: null });
	const [capacity, setCapacity] = useState('');
	const [location, setLocation] = useState('');
	const [description, setDescription] = useState('');

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

			<TextInput
				placeholder="Título"
				value={title}
				onChangeText={setTitle}
				style={{ borderBottomWidth: 1, marginBottom: 20 }}
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