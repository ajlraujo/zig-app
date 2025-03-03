import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World!</Text>
      <Link href={"/profile"} style={styles.button}>
        Meu Perfil
      </Link>
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
    color: "#black"
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline"
  }
});
