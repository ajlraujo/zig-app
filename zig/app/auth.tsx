import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Alert, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Text, TextInput, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function AuthScreen() {
	const router = useRouter();
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const LogoImage = require('../assets/images/logo.png');

	const API_URL = 'https://zig-app.onrender.com/api/auth/local';

	const validateForm = () => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

		if (!email.trim() || !password.trim()) {
			Alert.alert('Erro', 'Por favor, preencha todos os campos.');
			return false;
		}
		return true;
	};

	const handleAuth = async () => {
		if (!validateForm()) return;

		setIsLoading(true);

		try {
			const response = await axios.post(API_URL, {
				identifier: email,
				password: password,
			});

			await AsyncStorage.setItem("jwt", response.data.jwt);
			await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

			console.log('Login bem-sucedido:', response.data);
			router.replace("/home")
		} catch (error) {
			const errorMessages: Record<string, string> = {
				'invalid identifier or password': 'E-mail ou senha inválidos.',
			};

			const errorMessage = error.response?.data?.error?.message?.trim().toLowerCase() || '';

			const translatedMessage = errorMessages[errorMessage] ?? 'Erro ao fazer login. Tente novamente.';

			Alert.alert('Erro', translatedMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				style={local.container}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<ScrollView
					contentContainerStyle={local.scrollViewContent}
					keyboardShouldPersistTaps="handled"
				>
					<View style={local.header}>
						<Image
							source={LogoImage}
							style={{ width: 100, height: 100, marginTop: 20 }}
							resizeMode="contain"
						/>
					</View>

					<Text style={local.title} variant="headlineLarge">Conclua seu login</Text>

					<View style={local.formContainer}>
						<TextInput
							label="E-mail"
							mode="outlined"
							style={local.input}
							theme={inputTheme}
							outlineColor="#5881E9"
							activeOutlineColor="#5881E9"
							onChangeText={setEmail}
							textColor="#2D3436"
							value={email}
							keyboardType="email-address"
							autoCapitalize="none"
							disabled={isLoading}
							accessibilityLabel="Insira seu endereço de e-mail"
						/>
						<TextInput
							label="Senha"
							mode="outlined"
							style={local.input}
							theme={inputTheme}
							outlineColor="#5881E9"
							activeOutlineColor="#5881E9"
							onChangeText={setPassword}
							textColor="#2D3436"
							value={password}
							secureTextEntry
							disabled={isLoading}
							accessibilityLabel="Insira sua senha"
						/>
					</View>

					<View
						style={{ ...local.passwordHint, alignItems: 'flex-end' }}>
						<Text
							style={local.loginLink}
							onPress={() => router.push("/")}
						>
							Esqueci minha senha
						</Text>
					</View>

					<View style={local.buttonContainer}>
						<TouchableOpacity
							style={[local.button, isLoading && local.disabledButton]}
							onPress={handleAuth}
							disabled={isLoading}
							accessibilityRole="button"
						>
							{isLoading ? (
								<ActivityIndicator color="#fff" />
							) : (
								<Text
									style={local.buttonText}
								>
									Entrar
								</Text>
							)}
						</TouchableOpacity>

					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	)
}

const inputTheme = {
	colors: {
		primary: '#5881E9',
		onSurfaceVariant: '#5881E9',
		background: '#F1F1F1'
	}
};

const local = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollViewContent: {
		flexGrow: 1,
		alignItems: "center",
		paddingVertical: 40,
	},
	header: {
		alignItems: "center",
		marginBottom: 40,
	},
	title: {
		marginBottom: 32,
		color: '#5881E9',
		fontWeight: '600',
	},
	formContainer: {
		width: "80%",
	},
	input: {
		width: "100%",
		backgroundColor: "transparent",
		marginBottom: 16,
	},
	buttonContainer: {
		width: "80%",
		alignItems: "center",
	},
	button: {
		width: "100%",
		height: 50,
		backgroundColor: '#E1E958',
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 16,
	},
	disabledButton: {
		opacity: 0.7,
	},
	buttonText: {
		fontSize: 18,
		color: '#242424',
		fontWeight: "bold",
	},
	loginLink: {
		color: '#5881E9',
		fontWeight: "bold",
	},
});
