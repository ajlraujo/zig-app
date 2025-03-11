import React from "react";
import { View, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { Text, TextInput, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import LottieView from 'lottie-react-native';

export default function WelcomeScreen() {
	const router = useRouter();

	return (
		<View style={local.container}>

			<View style={local.topSection}>
				<LottieView
					source={require('@/assets/images/animation.json')}
					autoPlay
					loop
					style={local.animation}
				/>
			</View>

			<View style={local.content}>
				<Text style={local.title} variant="headlineLarge">Seja bem-vindo!</Text>
				<Text style={local.h3}>
					Dê um giro pela cidade e viva o local enquanto conhece novas pessoas
				</Text>

				<View style={local.buttonContainer}>
					<TouchableOpacity
						style={local.button}
						onPress={() => router.push("../signin")}
						accessibilityRole="button"
					>
						<Text style={local.buttonText}>Começar agora</Text>
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
			</View>
		</View>
	)
};

const local = StyleSheet.create({
	container: {
		flex: 1,
	},
	animation: {
		width: 450,
		height: 450,
	},
	topSection: {
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		marginBottom: 32,
		color: '#5881E9',
		fontWeight: '600',
	},
	content: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
	},
	h3: {
		fontSize: 20,
		color: '#242424',
		textAlign: "center",
		lineHeight: 24,
		fontWeight: "400",
		maxWidth: "80%",
		marginBottom: 60,
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
		fontWeight: "700",
	},
});
