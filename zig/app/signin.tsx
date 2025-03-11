import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Alert, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Text, TextInput, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import axios from 'axios';

export default function SigninScreen() {
	const router = useRouter();
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const LogoImage = require('../assets/images/logo.png');

	const API_URL = 'https://zig-app.onrender.com/api/auth/local/register';

	const validateForm = () => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

		if (!username.trim() || !email.trim() || !password.trim()) {
			Alert.alert('Erro', 'Por favor, preencha todos os campos.');
			return false;
		}

		if (!emailRegex.test(email)) {
			Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
			return false;
		}

		if (!passwordRegex.test(password)) {
			Alert.alert('Erro', 'A senha deve conter pelo menos 8 caracteres, incluindo letras e números.');
			return false;
		}

		return true;
	};

	const handleRegister = async () => {
		if (!validateForm()) return;

		setIsLoading(true);

		try {
			const response = await axios.post(API_URL, {
				username,
				email,
				password,
			});

			console.log('Registro bem-sucedido:', response.data);
			router.push('../auth');
		} catch (error) {
			const errorMessage = error.response?.data?.error?.message || 'Falha no registro. Tente novamente mais tarde.';
			Alert.alert('Erro', errorMessage);
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
							style={local.logoImage}
							resizeMode="contain"
						/>
					</View>

					<Text style={local.title} variant="headlineLarge">Crie sua conta</Text>

					<View style={local.formContainer}>
						<TextInput
							label="Nome"
							mode="outlined"
							style={local.input}
							theme={inputTheme}
							outlineColor="#5881E9"
							activeOutlineColor="#5881E9"
							onChangeText={setUsername}
							textColor="#242424"
							value={username}
							disabled={isLoading}
							accessibilityLabel="Insira seu nome completo"
						/>
						<TextInput
							label="E-mail"
							mode="outlined"
							style={local.input}
							theme={inputTheme}
							outlineColor="#5881E9"
							activeOutlineColor="#5881E9"
							onChangeText={setEmail}
							textColor="#242424"
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
							textColor="#242424"
							value={password}
							secureTextEntry
							disabled={isLoading}
							accessibilityLabel="Insira sua senha"
						/>
					</View>

					<View style={local.passwordHint}>
						<Text style={local.hintText}>Sua senha deve conter pelo menos 8 caracteres, incluindo letras e números.</Text>
					</View>

					<View style={local.buttonContainer}>
						<TouchableOpacity
							style={[local.button, isLoading && local.disabledButton]}
							onPress={handleRegister}
							disabled={isLoading}
							accessibilityRole="button"
						>
							{isLoading ? (
								<ActivityIndicator color="#fff" />
							) : (
								<Text style={local.buttonText}>Criar conta</Text>
							)}
						</TouchableOpacity>

						<Text style={local.loginText}>
							Já tem uma conta?{' '}
							<Text
								style={local.loginLink}
								onPress={() => router.push("../login")}
								accessibilityRole="link"
							>
								Entrar
							</Text>
						</Text>
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
	logoImage: {
		width: 100,
		height: 100,
		marginTop: 20,
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
	passwordHint: {
		width: "80%",
		marginBottom: 24,
	},
	hintText: {
		color: "#11181C",
		fontSize: 12,
		lineHeight: 16.8,
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
	loginText: {
		color: '#242424',
		fontSize: 14,
	},
	loginLink: {
		color: '#5881E9',
		fontWeight: "bold",
	},
});
