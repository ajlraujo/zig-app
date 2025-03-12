import { Ionicons } from '@expo/vector-icons';
import { Tabs } from "expo-router";

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#242424",
				tabBarStyle: {
					backgroundColor: "#F6F6F6"
				},
				tabBarShowLabel: false,
			}}
		>
			<Tabs.Screen name="home" options={{
				headerShown: false,
				tabBarIcon: ({ focused, color }) => (
					<Ionicons
						name={focused ? "albums-sharp" : "albums-outline"}
						color={color}
						size={28}
					/>
				),
			}}
			/>
			<Tabs.Screen name="add" options={{
				headerShown: false,
				tabBarStyle: { display: "none" },
				tabBarIcon: ({ focused, color }) => (
					<Ionicons
						name={focused ? "add-sharp" : "add-outline"}
						color={color}
						size={32}
					/>
				),
			}}
			/>
			<Tabs.Screen name="profile" options={{
				headerShown: false,
				tabBarIcon: ({ focused, color }) => (
					<Ionicons
						name={focused ? "person-circle-sharp" : "person-circle-outline"}
						color={color}
						size={28}
					/>
				),
			}}
			/>
			<Tabs.Screen name="not-found" options={{
				headerShown: false,
			}}
			/>
		</Tabs>
	);
}
