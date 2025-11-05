import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ScreenBackground from "../components/ScreenBackground";

export default function Step2Screen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScreenBackground>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <Text style={styles.title}>
              Stap 2: Ben je particulier of zakelijk?
            </Text>

            <TouchableOpacity
              style={[styles.button, styles.fullWidth]}
              onPress={() => navigation.navigate("Particulier")}
            >
              <Text style={styles.buttonText}>Particulier</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.fullWidth]}
              onPress={() => navigation.navigate("ZakelijkDoel")}
            >
              <Text style={styles.buttonText}>Zakelijk</Text>
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
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    maxWidth: 1200,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3eaf4f",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#f7941e",
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  fullWidth: {
    alignSelf: "stretch",
    marginHorizontal: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
