import React from 'react';
import { Alert, View, Image, TouchableOpacity, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { styles } from '../constants/Styles';
import useMediaLibraryPermission from '../hooks/useMediaLibraryPermission';

interface ImagePickerComponentProps {
	image: string;
	setImage: (uri: string) => void;
}

const ImagePickerComponent = ({ image, setImage }: ImagePickerComponentProps) => {
	const hasPermission = useMediaLibraryPermission();

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
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	return (
		<View style={styles.imageContainer}>
			<TouchableOpacity onPress={pickImage} style={{ position: 'relative' }}>
				<View style={styles.imageWrapper}>
					{image ? (
						<Image source={{ uri: image }} style={styles.image} />
					) : (
						<Text>Adicionar Imagem</Text>
					)}
				</View>
				<IconButton
					icon="image-plus"
					size={18}
					style={styles.addButton}
					iconColor="#212121"
				/>
			</TouchableOpacity>
		</View>
	);
};

export default ImagePickerComponent;
