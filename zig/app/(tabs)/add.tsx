import { Ionicons } from "@expo/vector-icons";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

export default function AddScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Hello World!</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		color: "#000"
	}
});
