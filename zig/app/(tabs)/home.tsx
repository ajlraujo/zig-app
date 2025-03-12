import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'https://zig-app.onrender.com/api/events?populate=*';

interface Evento {
	id: number;
	title: string;
	startDate: string;
	endDate: string;
	location: string;
	description: string;
	image: {
		url: string;
	};
}

export default function HomeScreen() {
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [eventos, setEventos] = useState<Evento[]>([]);
	const [confirmados, setConfirmados] = useState<number[]>([]);
	const [expandedCards, setExpandedCards] = useState<number[]>([]);
	const [userName, setUserName] = useState('Lucas'); // Altere para buscar dinamicamente o nome do usuário

	const fetchEventos = async () => {
		try {
			const response = await fetch(API_URL);
			const data = await response.json();
			setEventos(data.data);
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
			fetchEventos();
		}, [])
	);

	const onRefresh = () => {
		setRefreshing(true);
		fetchEventos();
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
		setConfirmados((prev) =>
			prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
		);
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

	// Componente de cabeçalho que será renderizado dentro da FlatList
	const renderHeader = () => (
		<Text style={styles.headerText}>Olá, {userName}! Qual o roteiro de hoje?</Text>
	);

	return (
		<View style={styles.container}>
			<FlatList
				data={eventos}
				keyExtractor={(item) => item.id.toString()}
				ListHeaderComponent={renderHeader}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.card}
						activeOpacity={0.8}
						onPress={() => toggleExpand(item.id)}
					>
						<View style={styles.imageContainer}>
							<Image
								source={
									item.image?.url
										? { uri: `https://zig-app.onrender.com${item.image.url}` }
										: require('../../assets/images/placeholder.png')
								}
								style={styles.image}
							/>
						</View>
						<View style={styles.cardContent}>
							<Text style={styles.title}>{item.title}</Text>
							<View style={styles.detailsContainer}>
								<Ionicons name="calendar-outline" size={16} color="#7D7D7D" />
								<Text style={styles.date}>{formatDate(item.startDate, item.endDate)}</Text>
							</View>
							<View style={styles.detailsContainer}>
								<Ionicons name="location-outline" size={16} color="#7D7D7D" />
								<Text style={styles.location}>{item.location}</Text>
							</View>
							<Text
								style={styles.description}
								numberOfLines={expandedCards.includes(item.id) ? undefined : 1}
							>
								{item.description}
							</Text>
							<View style={styles.buttonContainer}>
								<Button
									mode="contained"
									style={[
										styles.button,
										confirmados.includes(item.id) && styles.buttonConfirmed,
									]}
									labelStyle={styles.buttonLabel}
									onPress={() => handleConfirm(item.id)}
								>
									{confirmados.includes(item.id)
										? 'Confirmado!'
										: 'Quero ir'}
								</Button>
							</View>
						</View>
					</TouchableOpacity>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#FAF8F5',
	},
	headerText: {
		fontSize: 22,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 20,
	},
	card: {
		backgroundColor: '#FFFFFF',
		borderRadius: 20,
		marginBottom: 20,
		paddingBottom: 25,
	},
	imageContainer: {
		width: '100%',
		height: 250,
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
		backgroundColor: '#4CAF50',
	},
	buttonLabel: {
		fontSize: 16,
	},
});
