import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuth() {
	const [userId, setUserId] = useState<string | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const getAuthData = async () => {
			try {
				const storedToken = await AsyncStorage.getItem('jwt');

				if (!storedToken) {
					setError('Usuário não autenticado');
					return;
				}

				const base64Url = storedToken.split('.')[1]; // Pega o payload do JWT
				const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
				const jsonPayload = decodeURIComponent(
					atob(base64)
						.split('')
						.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
						.join('')
				);

				const decodedToken = JSON.parse(jsonPayload);
				setUserId(decodedToken.id);
				setToken(storedToken);
			} catch (err) {
				setError('Erro ao decodificar o token');
			}
		};

		getAuthData();
	}, []);

	return { userId, token, error };
}
