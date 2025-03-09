import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

type Props = {
	initialValue?: string;
	onSave: (description: string) => void;
};

export type DescriptionDialogHandle = {
	open: () => void;
	close: () => void;
};

const DescriptionDialog = forwardRef<DescriptionDialogHandle, Props>(({
	initialValue = '',
	onSave,
}, ref) => {
	const [visible, setVisible] = useState(false);
	const [description, setDescription] = useState(initialValue);

	useImperativeHandle(ref, () => ({
		open: () => {
			setDescription(initialValue);
			setVisible(true);
		},
		close: () => setVisible(false)
	}));

	const handleSave = () => {
		onSave(description);
		setVisible(false);
	};

	if (!visible) return null;

	return (
		<View style={styles.overlay}>
			<View style={styles.container}>
				<Text style={styles.title}>Descrição do Roteiro</Text>

				<TextInput
					style={styles.input}
					placeholder="Como vai ser o rolê? Conta pra gente"
					placeholderTextColor="#9C9C9C"
					multiline
					numberOfLines={4}
					value={description}
					onChangeText={setDescription}
					textAlignVertical="top"

				/>

				<View style={styles.buttonRow}>
					<TouchableOpacity
						style={styles.confirmButton}
						onPress={handleSave}
					>
						<Text style={styles.confirmButtonText}>Concluído</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
});

const styles = StyleSheet.create({
	overlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.5)', // Aumente a opacidade
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 10,
		zIndex: 9999,
	},
	container: {
		width: '90%',
		backgroundColor: 'white',
		borderRadius: 25,
		padding: 20,
		marginHorizontal: 20,
	},
	title: {
		fontSize: 18.75,
		fontWeight: '600',
		marginBottom: 16,
		color: '#3C3C3C',
	},
	input: {
		minHeight: 100,
		borderWidth: 1,
		borderColor: '#E0E0E0',
		borderRadius: 8,
		padding: 16,
		marginBottom: 20,
		color: '#3C3C3C',
		textAlignVertical: 'top',
		fontSize: 16,
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	confirmButton: {
		backgroundColor: '#3C3C3C',
		borderRadius: 25,
		paddingVertical: 10,
		paddingHorizontal: 25,
		minHeight: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	confirmButtonText: {
		color: 'white',
		fontWeight: '400',
		fontSize: 15,
	},
});

export default DescriptionDialog;