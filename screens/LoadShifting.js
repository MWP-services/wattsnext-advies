// screens/LoadShiftingVraagScreen.js
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import ScreenBackground from "../components/ScreenBackground";
export default function LoadShifting({ navigation }) {
  const [vermogen, setVermogen] = useState("");
  const [duur, setDuur] = useState("");

  const handleNext = () => {
    const p = parseFloat(vermogen);
    const t = parseFloat(duur);

    if (!isNaN(p) && !isNaN(t) && p > 0 && t > 0) {
      const kwh1 = (p * t) / 0.9; // Efficiëntie = 90%
      console.log("LoadShifting kwh1:", kwh1);
      navigation.navigate("LoadShiftingNoodstroomVraag", { kwh1 });
    } else {
      alert("Vul geldige waarden in.");
    }
  };

  return (
    <View style={styles.container}>
      <ScreenBackground>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={80}
          >
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
            >
            <Text style={styles.title}>
              Energie-inkoop optimaliseren (Load Shifting)
            </Text>

            <Text style={styles.label}>Gewenst vermogen (kW)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={vermogen}
              onChangeText={setVermogen}
              placeholder="Bijv. 50"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Duur verschuiving (uren)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={duur}
              onChangeText={setDuur}
              placeholder="Bijv. 3"
              placeholderTextColor="#aaa"
            />

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Ga verder</Text>
            </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
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
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    alignSelf: "center",
    width: "100%",
    maxWidth: 1200,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#4CAF50",
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fff", // Input zelf blijft wit
  },
  button: {
    backgroundColor: "#FF7F00",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "stretch",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
