import React from 'react';
import { Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { styles } from '../constants/Styles';

interface HeaderProps {
	isFormComplete: boolean;
	onConfirm: () => void;
}

const Header = ({ isFormComplete, onConfirm }: HeaderProps) => {
	const router = useRouter();
	return (
		<Appbar.Header style={styles.appBar}>
			<Appbar.Action
				icon="close"
				iconColor="#3C3C3C"
				onPress={() => router.push('/home')}
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
