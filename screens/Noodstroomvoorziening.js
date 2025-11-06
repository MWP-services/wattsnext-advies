import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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
export default function Noodstroomvoorziening({ navigation }) {
  const [kritischVerbruik, setKritischVerbruik] = useState("");
  const [backupTijd, setBackupTijd] = useState("");

  const handleNext = () => {
    const v = parseFloat(kritischVerbruik);
    const t = parseFloat(backupTijd);
    if (!isNaN(v) && !isNaN(t) && v > 0 && t > 0) {
      const kwh1 = (v * t) / 0.9;
      navigation.navigate("ZakelijkAdviesNoodstroom", { kwh1 });
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
            <Text style={styles.title}>Noodstroomvoorziening</Text>

            <Text style={styles.label}>Benodigde capaciteit (kWh)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={kritischVerbruik}
              onChangeText={setKritischVerbruik}
              placeholder="Bijv. 3.5"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Backuptijd (uren)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={backupTijd}
              onChangeText={setBackupTijd}
              placeholder="Bijv. 2"
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
    marginBottom: 20,
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
    backgroundColor: "#fff", // Inputveld wit voor leesbaarheid
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
