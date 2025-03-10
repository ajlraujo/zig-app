import React, { useEffect } from 'react';
import { Alert, View, Image, TouchableOpacity, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { styles } from '../constants/Styles';
import useMediaLibraryPermission from '../hooks/useMediaLibraryPermission';

interface ImageData {
	uri: string;
	name: string;
	type: string;
}

interface ImagePickerComponentProps {
	image: ImageData | null;
	setImage: (file: ImageData | null) => void;
}

const ImagePickerComponent = ({ image, setImage }: ImagePickerComponentProps) => {
	const hasPermission = useMediaLibraryPermission();

	// Log para depuração
	useEffect(() => {
		console.log('Imagem selecionada:', image);
	}, [image]);

	const pickImage = async () => {
		if (hasPermission === false) {
			Alert.alert(
				'Permissão negada',
				'Você precisa permitir o acesso à galeria nas configurações.'
			);
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			aspect: [4, 3],
			quality: 1,
			allowsMultipleSelection: false,
		});

		if (!result.canceled && result.assets[0]) {
			const uri = result.assets[0].uri;
			const fileName = uri.split('/').pop() || `image_${Date.now()}`;
			const fileType = result.assets[0].mimeType || 'image/jpeg';

			setImage({
				uri,
				name: fileName,
				type: fileType,
			});
		}
	};

	return (
		<View style={styles.imageContainer}>
			<TouchableOpacity onPress={pickImage} style={{ position: 'relative' }}>
				<View style={styles.imageWrapper}>
					{image ? (
						<Image source={{ uri: image }} style={styles.image} />
					) : (
						<Text>Selecione uma imagem</Text>
					)}
				</View>
				<IconButton
					icon="image-plus"
					size={18}
					style={styles.addButton}
					iconColor="#3C3C3C"
				/>
			</TouchableOpacity>
		</View>
	);
};

export default ImagePickerComponent;
