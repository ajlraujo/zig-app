import { Provider as PaperProvider } from "react-native-paper";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
	return (
		<PaperProvider>
			<StatusBar style="dark" />
			<Stack>
				<Stack.Screen
					name="(tabs)"
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="not-found"
					options={{ headerShown: false }}
				/>
			</Stack>
		</PaperProvider>
	);
}
