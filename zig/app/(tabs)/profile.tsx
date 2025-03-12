import React, { useState, useEffect, useCallback } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {

	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const { username, token, userId } = useAuth();
	const router = useRouter();

	const fetchEvents = async () => {
		try {
			const response = await fetch(`https://zig-app.onrender.com/api/events?filters[ownerID][user][$eq]=4`);
			const result = await response.json();

			if (response.ok) {
				setEvents(result.data);
			} else {
				Alert.alert('Erro', 'Não foi possível carregar os eventos.');
			}
		} catch (error) {
			Alert.alert('Erro', 'Ocorreu um erro ao buscar eventos.');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			setLoading(true);
			fetchEvents();
		}, [])
	);

	const onRefresh = () => {
		setRefreshing(true);
		fetchEvents();
	};

	const handleEdit = (id: number) => {
		const eventToEdit = events.find(event => event.id === id);
		if (eventToEdit) {
			router.replace({
				pathname: '../edit',
				params: {
					eventId: id.toString(),
					title: eventToEdit.title,
					location: eventToEdit.location,
					description: eventToEdit.description,
					startDate: eventToEdit.startDate,
					endDate: eventToEdit.endDate,
					imageId: eventToEdit.image?.data?.id
				}
			});
		}
	};

	const handleDelete = (id: number) => {
		Alert.alert(
			"Deletar evento",
			`Tem certeza que deseja deletar esse evento?`,
			[
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Deletar",
					onPress: async () => {
						try {
							const response = await fetch(`https://zig-app.onrender.com/api/events/${id}`, {
								method: "DELETE",
								headers: {
									"Authorization": `Bearer ${token}`,
									"Content-Type": "application/json",
								},
							});

							if (response.status === 204) {
								Alert.alert("Evento deletado com sucesso!");
								setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
							} else {
								Alert.alert("Erro", "Não foi possível deletar o evento.");
							}
						} catch (error) {
							Alert.alert("Erro", "Ocorreu um erro ao tentar deletar o evento.");
						}
					},
				},
			]
		);
	};

	if (loading) {
		return (
			<ActivityIndicator
				size="large"
				color="#000"
				style={{ flex: 1, justifyContent: 'center' }}
			/>
		);
	}

	const renderEvent = (item) => (
		<View style={local.card} key={item.id}>
			<Text style={local.title}>{item.title}</Text>
			<View style={local.detailsContainer}>
				<Ionicons name="location-outline" size={16} color="#7D7D7D" />
				<Text style={local.location}>{item.location}</Text>
			</View>
			<Text style={local.description}>
				{item.description}
			</Text>
			<View style={local.buttonContainer}>
				<TouchableOpacity
					style={local.button}
					onPress={() => handleEdit(item.id)}
				>
					<Ionicons name="pencil" size={20} color="white" />
					<Text style={local.buttonText}>Editar</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[local.button, local.deleteButton]}
					onPress={() => handleDelete(item.id)}
				>
					<Ionicons name="trash" size={20} color="white" />
					<Text style={local.buttonText}>Deletar</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	return (
		<ScrollView contentContainerStyle={local.container}>
			<Text style={local.headerText}>Meu Roteiro</Text>
			{events.map(renderEvent)}
		</ScrollView>
	);
}

const local = StyleSheet.create({
	container: {
		flexGrow: 1,
		justifyContent: "flex-start",
		alignItems: "center",
		backgroundColor: "#f5f5f5",
		paddingTop: 50,
		paddingHorizontal: 10,
	},
	headerText: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
	},
	card: {
		backgroundColor: '#FFFFFF',
		padding: 15,
		borderRadius: 20,
		marginBottom: 20,
		paddingBottom: 25,
		width: "95%",
		maxWidth: 400,
		alignSelf: "center",
	},
	detailsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 5,
	},
	title: {
		fontSize: 30,
		color: '#7D7D7D',
		marginBottom: 10,
	},
	location: {
		fontSize: 14,
		color: '#7D7D7D',
		marginLeft: 5,
	},
	description: {
		fontSize: 14,
		color: '#7D7D7D',
		marginVertical: 10,
	},
	buttonContainer: {
		flexDirection: "row",
		marginTop: 10,
		justifyContent: "space-between",
	},
	button: {
		backgroundColor: "#4CAF50",
		padding: 10,
		borderRadius: 5,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	deleteButton: {
		backgroundColor: "#f44336",
	},
	buttonText: {
		color: "white",
		marginLeft: 5,
		fontWeight: "bold",
	},
});
