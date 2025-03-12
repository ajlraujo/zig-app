import React, { useRef, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { IconButton, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

import Header from '@/components/Header';
import InputDialog from '@/components/InputDialog';
import ImagePickerComponent from '@/components/ImagePickerComponent';
import DescriptionDialog, { DescriptionDialogHandle } from '@/components/DescriptionDialog';
import LocationDialog, { LocationDialogHandle } from '@/components/LocationDialog';
import { styles } from '@/constants/Styles';
import useDialog, { DialogType } from '@/hooks/useDialog';

export default function AddEventScreen() {
	const { userId, token, error } = useAuth();
	const [image, setImage] = useState('');
	const [title, setTitle] = useState('');
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(() => {
		const date = new Date();
		date.setHours(date.getHours() + 1);
		return date;
	});
	const [location, setLocation] = useState('');
	const [description, setDescription] = useState('');
	const [loading, setLoading] = useState(false);

	const dialogRef = useRef<DescriptionDialogHandle>(null);
	const locationDialogRef = useRef<LocationDialogHandle>(null);
	const [dialogVisible, setDialogVisible] = useState(false);
	const [isTitleFocused, setIsTitleFocused] = useState(false);

	const API_URL = 'https://zig-app.onrender.com/api/events';
	const STRAPI_UPLOAD_URL = 'https://zig-app.onrender.com/api/upload';

	const isFormComplete = !!image && !!title && !!description && !!location;

	const handleFileUpload = async () => {

		try {
			const formData = new FormData();
			formData.append('files', {
				uri: image,
				name: 'image.jpg',
				type: 'image/jpeg',
			} as any);

			const uploadResponse = await fetch(STRAPI_UPLOAD_URL, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
				},
				body: formData,
			});

			if (!uploadResponse.ok) {
				const errorBody = await uploadResponse.text();
				console.error(`Erro no upload. Status: ${uploadResponse.status}, Resposta: ${errorBody}`);
				throw new Error(`Falha ao enviar a imagem. Status: ${uploadResponse.status}`);
			}

			const uploadedImages = await uploadResponse.json();
			console.log('Resposta da API após upload:', uploadedImages);

			return uploadedImages[0]?.id;
		} catch (error) {
			console.error('Erro no upload do arquivo:', error);
			throw error;
		}
	};

	const resetForm = () => {
		setImage('');
		setTitle('');
		setStartDate(new Date());
		setEndDate(() => {
			const date = new Date();
			date.setHours(date.getHours() + 1);
			return date;
		});
		setLocation('');
		setDescription('');
	};

	const handleConfirm = async () => {

		if (!token) {
			Alert.alert('Erro', 'Faça login novamente');
			router.push('/login');
			return;
		}

		if (!isFormComplete) {
			Alert.alert('Por favor, preencha todos os campos obrigatórios.');
			return;
		}

		setLoading(true);

		try {
			// Inicia o upload da imagem e o envio dos dados do evento
			const imageId = await handleFileUpload();

			if (!imageId) {
				throw new Error('Falha ao enviar a imagem.');
			}

			const eventData = {
				data: {
					title,
					startDate: startDate.toISOString(),
					endDate: endDate.toISOString(),
					location,
					description,
					image: imageId,
					ownerID: {
						user: userId,
					}
				},
			};

			console.log('Payload do evento:', JSON.stringify(eventData, null, 2));

			const response = await fetch(API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(eventData),
			});

			const result = await response.json();

			if (!response.ok) {
				console.error('Erro ao criar evento:', result);
				await fetch(`${STRAPI_UPLOAD_URL}/files/${imageId}`, {
					method: 'DELETE',
					headers: {
						'Authorization': `Bearer ${token}`,
					},
				});
				throw new Error(`Falha ao criar evento. Resposta: ${JSON.stringify(result)}`);
			}

			Alert.alert('Roteiro criado com sucesso!');
			resetForm();
			router.back();
		} catch (error: any) {
			console.error('Erro:', error);
			Alert.alert('Erro', error.message || 'Ocorreu um erro ao criar o roteiro.');
		} finally {
			setLoading(false);
		}
	};

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
						disabled={!isFormComplete || loading}
						style={[styles.createButton, { width: '80%', alignSelf: 'center' }]}
						labelStyle={styles.createButtonText}
						loading={loading}  // Exibe indicador de loading no botão
					>
						Publicar
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
