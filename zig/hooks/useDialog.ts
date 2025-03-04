import { useState } from 'react';

export type DialogType = 'title' | 'location' | 'description' | null;

const useDialog = () => {
	const [visible, setVisible] = useState(false);
	const [dialogType, setDialogType] = useState<DialogType>(null);
	const [tempValue, setTempValue] = useState('');

	const showDialog = (type: DialogType, currentValue: string) => {
		setDialogType(type);
		setTempValue(currentValue);
		setVisible(true);
	};

	const hideDialog = () => {
		setVisible(false);
		setDialogType(null);
	};

	const saveDialogValue = (onSave: (value: string) => void) => {
		onSave(tempValue);
		hideDialog();
	};

	return { visible, dialogType, tempValue, setTempValue, showDialog, hideDialog, saveDialogValue };
};

export default useDialog;
