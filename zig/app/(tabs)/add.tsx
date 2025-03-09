import React, { useRef, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { IconButton, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import Header from '../../components/Header';
import InputDialog from '../../components/InputDialog';
import ImagePickerComponent from '../../components/ImagePickerComponent';
import DescriptionDialog, { DescriptionDialogHandle } from '../../components/DescriptionDialog';
import LocationDialog, { LocationDialogHandle } from '../../components/LocationDialog';
import { styles } from '../../constants/Styles';
import useDialog, { DialogType } from '../../hooks/useDialog';
import { EventData } from '../../types/events';
import api from '../../services/api';

export default function AddEventScreen() {
	const [image, setImage] = useState<string>('');
	const [title, setTitle] = useState('');
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(() => {
		const date = new Date();
		date.setHours(date.getHours() + 1);
		return date;
	});
	const [location, setLocation] = useState('');
	const [description, setDescription] = useState('');
	const dialogRef = useRef<DescriptionDialogHandle>(null);
	const locationDialogRef = useRef<LocationDialogHandle>(null);
	const [dialogVisible, setDialogVisible] = useState(false);
	const [isTitleFocused, setIsTitleFocused] = useState(false);


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

	const isFormComplete = !!image && !!title && !!description && !!location;

	const roundToNearest30 = (date: Date): Date => {
		const minutes = date.getMinutes();
		const mod = minutes % 30;
		const newMinutes = mod < 15 ? minutes - mod : minutes + (30 - mod);
		const roundedDate = new Date(date);
		roundedDate.setMinutes(newMinutes);
		roundedDate.setSeconds(0);
		roundedDate.setMilliseconds(0);
		return roundedDate;
	};

	const handleConfirm = async () => {
		try {
			const eventData: EventData = {
				title,
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
				location,
				description,
				image,
			};

			await api.post('/events', { data: eventData });
			router.push('/');
		} catch (error: any) {
			const errorMessage = error.message || 'Erro desconhecido ao criar roteiro';
			console.error('Erro detalhado:', error);
			Alert.alert('Erro', errorMessage);
		}
	};

	const handleDateChange = (type: 'start' | 'end', selectedDate: Date | undefined) => {
		if (!selectedDate) return;
		// No Android, arredonda a data para o intervalo de 30 minutos
		const date = Platform.OS === 'android' ? roundToNearest30(selectedDate) : selectedDate;
		if (type === 'start') {
			setStartDate(date);
		} else {
			setEndDate(date);
		}
	};

	const getDialogTitle = (): string => {
		switch (dialogType as DialogType) {
			case 'location':
				return 'Adicionar local';
			case 'description':
				return 'Descrição do roteiro';
			default:
				return '';
		}
	};

	const getPlaceholder = (): string => {
		switch (dialogType as DialogType) {
			case 'location':
				return 'Insira o local';
			case 'description':
				return 'O que vai acontecer?';
			default:
				return '';
		}
	};

	const onSaveDialog = () => {
		if (dialogType === 'location') {
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
			<LinearGradient
				colors={['#FAF8F5', 'rgba(250,248,245,0.8)', '#FFFFFF']}
				locations={[0, 0.5, 1]}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 1 }}
				style={styles.gradientBackground}
			>
				<ScrollView
					style={styles.container}
					contentContainerStyle={{
						paddingBottom: 5,
					}}
				>
					<ImagePickerComponent image={image} setImage={setImage} />

					<TextInput
						style={[
							styles.titleText,
							{
								color: title ? '#3C3C3C' : '#B0B0B0',
								paddingVertical: 12,
							},
						]}
						placeholder="Adicionar Nome"
						placeholderTextColor="#B0B0B0"
						value={title}
						onChangeText={setTitle}
						autoCorrect={false}
						autoCapitalize="words"
						returnKeyType="done"
						accessibilityLabel="Campo para nome do roteiro"
						cursorColor="#3C3C3C"
						selectionColor="#E0E0E0"
						onFocus={() => setIsTitleFocused(true)}
						onBlur={() => setIsTitleFocused(false)}
					/>

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
								minuteInterval={Platform.OS === 'ios' ? 30 : undefined}
								style={{ flex: 1 }}
							/>
						</View>
					</View>

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
								minuteInterval={Platform.OS === 'ios' ? 30 : undefined}
								style={{ flex: 1 }}
							/>
						</View>
					</View>

					<TouchableOpacity
						style={styles.touchableButton}
						onPress={() => locationDialogRef.current?.open()}
					>
						<View style={styles.buttonContent}>
							<IconButton
								icon="map-marker"
								iconColor="#B0B0B0"
								size={20}
								style={styles.icon}
							/>
							<Text style={[styles.buttonText, { color: location ? '#404040' : '#9C9C9C' }, { fontWeight: location ? '500' : 'regular' }]}>
								{location || 'Adicionar Local'}
							</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.touchableButton, { minHeight: description ? 80 : 50 }]}
						onPress={() => dialogRef.current?.open()}
					>
						<View style={[styles.buttonContent, { alignItems: description ? 'flex-start' : 'center' }]}>
							<IconButton
								icon="file-document"
								iconColor="#B0B0B0"
								size={20}
								style={styles.icon}
							/>
							<Text
								style={[
									styles.buttonText,
									{
										color: description ? '#404040' : '#9C9C9C',
									}
								]}
								numberOfLines={2}
								ellipsizeMode="tail"
							>
								{description || 'Adicionar Descrição'}
							</Text>
						</View>
					</TouchableOpacity>

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
				<View style={[styles.fixedButtonContainer, { alignItems: 'center' }]}>
					<Button
						mode="contained"
						onPress={handleConfirm}
						disabled={!isFormComplete}
						style={[styles.createButton, { width: '80%', alignSelf: 'center' }]}
						labelStyle={styles.createButtonText}
					>Publicar
					</Button>
				</View>
			</LinearGradient>
			<LocationDialog
				ref={locationDialogRef}
				initialValue={location}
				onSave={(newLocation) => setLocation(newLocation)}
			/>
			<DescriptionDialog
				ref={dialogRef}
				visible={dialogVisible}
				initialValue={description}
				onClose={() => setDialogVisible(false)}
				onSave={(newDescription) => {
					setDescription(newDescription);
					setDialogVisible(false);
				}}
			/>
		</View>
	);
}
