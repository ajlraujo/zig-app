import React from 'react';
import { Appbar } from 'react-native-paper';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../constants/Styles';

interface HeaderProps {
	isFormComplete: boolean;
	onConfirm: () => void;
}

const Header = ({ isFormComplete, onConfirm }: HeaderProps) => {
	const router = useRouter();

	const handleClose = () => {
		Alert.alert(
			'Fechar Roteiro',
			'Você tem certeza que deseja fechar sem salvar?',
			[
				{
					text: 'Cancelar',
					style: 'cancel',
				},
				{
					text: 'Fechar',
					onPress: () => router.push('/home'),
				},
			]
		);
	};

	return (
		<Appbar.Header style={styles.appBar}>
			<Appbar.Action
				icon="close"
				iconColor="#3C3C3C"
				onPress={handleClose}
			/>
			<Appbar.Content
				title="Criar Roteiro"
				titleStyle={styles.headerTitle}
			/>
			<Appbar.Action icon={undefined} disabled />
		</Appbar.Header>
	);
};

export default Header;
