import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';

const useMediaLibraryPermission = () => {
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);

	useEffect(() => {
		(async () => {
			const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
			setHasPermission(status === 'granted');
		})();
	}, []);

	return hasPermission;
};

export default useMediaLibraryPermission;
