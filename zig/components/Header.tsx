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
				iconColor="rgba(34, 41, 5, 0.3)"
				onPress={() => router.push('/')}
			/>
			<Appbar.Content
				title="Criar Rolê"
				titleStyle={styles.headerTitle}
			/>
			<Appbar.Action
				icon="check"
				iconColor={isFormComplete ? '#222905' : 'rgba(34, 41, 5, 0.3)'}
				onPress={onConfirm}
			/>
		</Appbar.Header>
	);
};

export default Header;
