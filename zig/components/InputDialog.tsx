import React from 'react';
import { TextInput, Button, Dialog, Portal } from 'react-native-paper';
import { styles } from '../constants/Styles';

interface InputDialogProps {
	visible: boolean;
	title: string;
	placeholder: string;
	value: string;
	onChangeText: (text: string) => void;
	onCancel: () => void;
	onSave: () => void;
}

const InputDialog = ({
	visible,
	title,
	placeholder,
	value,
	onChangeText,
	onCancel,
	onSave,
}: InputDialogProps) => {
	return (
		<Portal>
			<Dialog visible={visible} onDismiss={onCancel} style={styles.dialogContainer}>
				<Dialog.Title style={styles.dialogTitle}>{title}</Dialog.Title>
				<Dialog.Content>
					<TextInput
						placeholder={placeholder}
						value={value}
						onChangeText={onChangeText}
						style={styles.dialogInput}
						activeUnderlineColor="#D1D1D1"
						textColor="#404040"
					/>
				</Dialog.Content>
				<Dialog.Actions>
					<Button labelStyle={styles.dialogButton} onPress={onCancel}>
						Cancelar
					</Button>
					<Button labelStyle={styles.dialogButton} onPress={onSave}>
						Salvar
					</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
};

export default InputDialog;
