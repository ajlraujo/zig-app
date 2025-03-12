import React, { useCallback, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';

const API_URL = 'https://zig-app.onrender.com/api/events?populate=*';

export default function HomeScreen() {
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [events, setEvents] = useState<[]>([]);
	const [confirmados, setConfirmados] = useState<number[]>([]);
	const [expandedCards, setExpandedCards] = useState<number[]>([]);
	const { username, token, userId } = useAuth();

	const fetchEvents = async () => {
		try {
			const response = await fetch(API_URL);
			const data = await response.json();

			if (!data.data) {
				console.error('Dados de eventos não encontrados!');
				return;
			}

			const eventosFormatados = data.data.map((evento: any) => {
				if (evento) {
					return {
						id: evento.id,
						title: evento.title,
						startDate: evento.startDate,
						endDate: evento.endDate,
						location: evento.location,
						description: evento.description,
						image: evento.image,
					};
				} else {
					console.warn('Evento com dados incompletos:', evento);
					return null;
				}
			}).filter((evento: any) => evento !== null);

			setEvents(eventosFormatados);
		} catch (error) {
			console.error('Erro ao buscar eventos:', error);
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

	const formatDate = (startDateString: string, endDateString: string) => {
		const startDate = new Date(startDateString);
		const endDate = new Date(endDateString);
		const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
		const formattedDay = new Intl.DateTimeFormat('pt-BR', options).format(startDate);

		const format24Hour = (date: Date) => {
			const hours = date.getHours().toString().padStart(2, '0');
			const minutes = date.getMinutes().toString().padStart(2, '0');
			return `${hours}:${minutes}`;
		};

		return `${formattedDay}, ${format24Hour(startDate)} às ${format24Hour(endDate)}`;
	};

	const handleConfirm = (id: number) => {
		Alert.alert('Confirmação', 'Você confirmou sua presença neste evento!');
		setConfirmados((prev) => [...prev, id]);
	};

	const toggleExpand = (id: number) => {
		setExpandedCards((prev) =>
			prev.includes(id) ? prev.filter(expandedId => expandedId !== id) : [...prev, id]
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
		<TouchableOpacity key={item.id} style={local.card} activeOpacity={0.8} onPress={() => toggleExpand(item.id)}>
			<View style={local.imageContainer}>
				<Image
					source={
						item.image?.url
							? { uri: `https://zig-app.onrender.com${item.image.url}` }
							: require('../../assets/images/placeholder.png')
					}
					style={local.image}
				/>
			</View>
			<View style={local.cardContent}>
				<Text style={local.title}>{item.title}</Text>
				<View style={local.detailsContainer}>
					<Ionicons name="calendar-outline" size={16} color="#7D7D7D" />
					<Text style={local.date}>{formatDate(item.startDate, item.endDate)}</Text>
				</View>
				<View style={local.detailsContainer}>
					<Ionicons name="location-outline" size={16} color="#7D7D7D" />
					<Text style={local.location}>{item.location}</Text>
				</View>
				<Text style={local.description} numberOfLines={expandedCards.includes(item.id) ? undefined : 1}>
					{item.description}
				</Text>
				<View style={local.buttonContainer}>
					<Button
						mode="contained"
						style={[local.button, confirmados.includes(item.id) && local.buttonConfirmed]}
						labelStyle={local.buttonLabel}
						onPress={() => handleConfirm(item.id)}
					>
						{confirmados.includes(item.id) ? 'Confirmado!' : 'Quero ir'}
					</Button>
				</View>
			</View>
		</TouchableOpacity>
	);

	return (
		< ScrollView contentContainerStyle={local.container} >
			<Text style={local.headerText}>
				Olá, {username ? username : 'Visitante'}! Qual o roteiro de hoje?
			</Text>
			{events.map(renderEvent)}
		</ScrollView >
	)
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
		borderRadius: 20,
		marginBottom: 20,
		paddingBottom: 25,
		width: "90%",
	},
	imageContainer: {
		width: '100%',
		height: 200,
		backgroundColor: '#E0E0E0',
		borderRadius: 20,
	},
	image: {
		width: '100%',
		height: '100%',
		borderRadius: 20,
	},
	cardContent: {
		padding: 20,
		paddingBottom: 0,
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
	date: {
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
		marginTop: 10,
	},
	button: {
		borderRadius: 20,
	},
	buttonConfirmed: {
		backgroundColor: '#E1E958',
	},
	buttonLabel: {
		fontSize: 16,
	},
});
