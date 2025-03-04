import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { IconButton, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import Header from '../../components/Header';
import InputDialog from '../../components/InputDialog';
import ImagePickerComponent from '../../components/ImagePickerComponent';
import { styles } from '../../constants/Styles';
import useDialog, { DialogType } from '../../hooks/useDialog';

export default function AddEventScreen() {
	const [image, setImage] = useState<string>('');
	const [title, setTitle] = useState('');
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(
		new Date(new Date().getTime() + 60 * 60 * 1000)
	);
	const [location, setLocation] = useState('');
	const [description, setDescription] = useState('');

	const router = useRouter();
	const {
		visible,
		dialogType,
		tempValue,
		setTempValue,
		showDialog,
		hideDialog,
		saveDialogValue,
	} = useDialog();

	const isFormComplete = image && title && description && location;

	const handleConfirm = () => {
		// implementar a lógica de criação do evento
		router.push('/');
	};

	const handleDateChange = (type: 'start' | 'end', selectedDate: Date | undefined) => {
		if (!selectedDate) return;
		if (type === 'start') {
			setStartDate(selectedDate);
		} else {
			setEndDate(selectedDate);
		}
	};

	const getDialogTitle = (): string => {
		switch (dialogType as DialogType) {
			case 'title':
				return 'Adicionar título';
			case 'location':
				return 'Adicionar localização';
			case 'description':
				return 'Adicionar descrição';
			default:
				return '';
		}
	};

	const getPlaceholder = (): string => {
		switch (dialogType as DialogType) {
			case 'title':
				return 'Digite aqui';
			case 'location':
				return 'Digite aqui';
			case 'description':
				return 'Digite aqui';
			default:
				return '';
		}
	};

	const onSaveDialog = () => {
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
		<View style={{ flex: 1 }}>
			<View style={styles.header}>
				<Header isFormComplete={isFormComplete} onConfirm={handleConfirm} />
			</View>
			<LinearGradient colors={['#EEEED4', '#FFFFFF']} style={styles.gradientBackground}>
				<ScrollView style={styles.container}>
					<ImagePickerComponent image={image} setImage={setImage} />

					{/* Título */}
					<TouchableOpacity style={styles.titleButton} onPress={() => showDialog('title', title)}>
						<Text style={[styles.titleText, { color: title ? '#3C3C3C' : '#B0B0B0' }]}>
							{title || 'Nome do rolê'}
						</Text>
					</TouchableOpacity>

					{/* Início */}
					<View style={styles.touchableButton}>
						<View style={styles.buttonContent}>
							<IconButton
								icon="clock"
								iconColor="#9C9C9C"
								size={18}
								style={styles.icon}
							/>
							<Text style={styles.buttonText}>Início:</Text>
							<DateTimePicker
								value={startDate}
								mode="datetime"
								display="default"
								themeVariant="light"
								onChange={(event, selectedDate) => {
									if (selectedDate) handleDateChange('start', selectedDate);
								}}
								style={{ flex: 1 }}
							/>
						</View>
					</View>

					{/* Fim */}
					<View style={styles.touchableButton}>
						<View style={styles.buttonContent}>
							<IconButton
								icon="clock-outline"
								iconColor="#9C9C9C"
								size={18}
								style={styles.icon}
							/>
							<Text style={styles.buttonText}>Fim:</Text>
							<DateTimePicker
								value={endDate}
								mode="datetime"
								display="default"
								themeVariant="light"
								onChange={(event, selectedDate) => {
									if (selectedDate) handleDateChange('end', selectedDate);
								}}
								style={{ flex: 1 }}
							/>
						</View>
					</View>

					{/* Localização */}
					<TouchableOpacity style={styles.touchableButton} onPress={() => showDialog('location', location)}>
						<View style={styles.buttonContent}>
							<IconButton
								icon="map-marker"
								iconColor="#B0B0B0"
								size={20}
								style={styles.icon}
							/>
							<Text style={[styles.buttonText, { color: location ? '#404040' : '#9C9C9C' }]}>
								{location || 'Onde vai acontecer?'}
							</Text>
						</View>
					</TouchableOpacity>

					{/* Descrição */}
					<TouchableOpacity style={styles.touchableButton} onPress={() => showDialog('description', description)}>
						<View style={styles.buttonContent}>
							<IconButton
								icon="file-document"
								iconColor="#B0B0B0"
								size={20}
								style={styles.icon}
							/>
							<Text style={[styles.buttonText, { color: '#9C9C9C' }]}>
								{description || 'O que vai rolar?'}
							</Text>
						</View>
					</TouchableOpacity>

					<View style={styles.buttonContainer}>
						<Button
							mode="contained"
							onPress={handleConfirm}
							disabled={!isFormComplete}
							style={styles.createButton}
							labelStyle={styles.createButtonText}
						>
							Publicar
						</Button>
					</View>

					<InputDialog
						visible={visible}
						title={getDialogTitle()}
						placeholder={getPlaceholder()}
						value={tempValue}
						onChangeText={setTempValue}
						onCancel={hideDialog}
						onSave={onSaveDialog}
					/>
				</ScrollView>
			</LinearGradient>
		</View>
	);
}