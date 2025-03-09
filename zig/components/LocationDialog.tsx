import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
	initialValue?: string;
	onSave: (location: string) => void;
};

export type LocationDialogHandle = {
	open: () => void;
	close: () => void;
};

const LocationDialog = forwardRef<LocationDialogHandle, Props>(({ initialValue = '', onSave }, ref) => {
	const [visible, setVisible] = useState(false);
	const [location, setLocation] = useState(initialValue);

	useImperativeHandle(ref, () => ({
		open: () => {
			setLocation(initialValue);
			setVisible(true);
		},
		close: () => setVisible(false),
	}));

	const handleSave = () => {
		onSave(location);
		setVisible(false);
	};

	if (!visible) return null;

	return (
		<View style={styles.overlay}>
			<View style={styles.container}>
				<Text style={styles.title}>Onde vai acontecer?</Text>

				<TextInput
					style={styles.input}
					placeholder="Informe o local do rolê"
					placeholderTextColor="#9C9C9C"
					value={location}
					onChangeText={setLocation}
				/>

				<View style={styles.buttonRow}>
					<TouchableOpacity style={styles.confirmButton} onPress={handleSave}>
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
		backgroundColor: 'rgba(0,0,0,0.5)',
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
		borderWidth: 1,
		borderColor: '#E0E0E0',
		borderRadius: 8,
		padding: 16,
		marginBottom: 20,
		color: '#3C3C3C',
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

export default LocationDialog;