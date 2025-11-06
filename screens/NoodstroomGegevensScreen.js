import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import ScreenBackground from "../components/ScreenBackground";
export default function NoodstroomGegevensScreen({ navigation, route }) {
  const [verbruik, setVerbruik] = useState("");
  const [tijd, setTijd] = useState("");

  const doorgaan = () => {
    const v = parseFloat(verbruik);
    const t = parseFloat(tijd);
    if (!isNaN(v) && !isNaN(t) && v > 0 && t > 0) {
      const kwh2 = (v * t) / 0.9;
      navigation.navigate("EnergiehandelVraag", { kwh2 });
    } else {
      alert("Vul geldige waarden in.");
    }
  };

  return (
    <View style={styles.container}>
      <ScreenBackground
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={80}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
            <Text style={styles.title}>Noodstroomvoorziening</Text>

            <Text style={styles.label}>Benodigde capaciteit (kWh)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={verbruik}
              onChangeText={setVerbruik}
              placeholder="Bijv. 5"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Backuptijd (uren)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={tijd}
              onChangeText={setTijd}
              placeholder="Bijv. 2"
              placeholderTextColor="#aaa"
            />

            <TouchableOpacity style={styles.button} onPress={doorgaan}>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignSelf: "center",
    width: "100%",
    maxWidth: 1200,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3eaf4f",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: "100%",
    backgroundColor: "#fff", // inputvelden blijven wit
  },
  button: {
    backgroundColor: "#f7941e",
    padding: 16,
    borderRadius: 10,
    alignSelf: "stretch",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
