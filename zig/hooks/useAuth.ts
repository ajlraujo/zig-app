import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuth() {
	const [userId, setUserId] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const getAuthData = async () => {
			try {
				const storedToken = await AsyncStorage.getItem('jwt');
				console.log('Token Salvo no AsyncStorage:', storedToken); // 🔴 Debug

				if (!storedToken) {
					setError('Usuário não autenticado');
					return;
				}

				const base64Url = storedToken.split('.')[1];
				const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
				const jsonPayload = decodeURIComponent(
					atob(base64)
						.split('')
						.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
						.join('')
				);

				const decodedToken = JSON.parse(jsonPayload);
				console.log('Token Decodificado:', decodedToken); // 🔴 Debug
				setUserId(decodedToken.id);
				setToken(storedToken);

				const response = await fetch(`https://zig-app.onrender.com/api/users/me`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${storedToken}`,
						'Content-Type': 'application/json',
					},
				});

				if (!response.ok) {
					throw new Error('Falha ao buscar usuário');
				}

				const userData = await response.json();
				console.log('Dados do usuário:', userData); // 🔴 Debug

				setUsername(userData.username || 'Visitante');
			} catch (err) {
				console.log('Erro:', err);
				setError('Erro ao carregar dados do usuário');
			}
		};

		getAuthData();
	}, []);

	return { userId, username, token, error };
}
