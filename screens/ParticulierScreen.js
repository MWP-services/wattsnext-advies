import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

import ScreenBackground from "../components/ScreenBackground";
export default function ParticulierScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScreenBackground
        style={styles.backgroundImage}
        resizeMode={Platform.OS === "web" ? "contain" : "cover"}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Terugknop */}
          <TouchableOpacity
            onPress={() => navigation.replace("LoginScreen")}
            style={styles.backTopLeft}
          >
            <Text style={styles.backText}>← Terug naar log-in</Text>
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.title}>Wat voor aansluiting heb je thuis?</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("Fase 1", { aansluiting: "1-fase" })
              }
            >
              <Text style={styles.buttonText}>1-fase aansluiting</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("Fase 3", { aansluiting: "3-fase" })
              }
            >
              <Text style={styles.buttonText}>3-fase aansluiting</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScreenBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
    position: "relative",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3eaf4f",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#f7941e",
    padding: 16,
    borderRadius: 10,
    marginVertical: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  backTopLeft: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#ffffffcc",
    borderRadius: 10,
    zIndex: 10,
  },
  backText: {
    color: "#1a73e8",
    fontSize: 16,
    fontWeight: "500",
  },
});
