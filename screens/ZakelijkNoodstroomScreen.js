import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ScreenBackground from "../components/ScreenBackground";

export default function ZakelijkNoodstroomScreen() {
  const [kritischVermogen, setKritischVermogen] = useState("");
  const [backuptijd, setBackuptijd] = useState("");

  const route = useRoute();
  const navigation = useNavigation();
  const { benodigdKWh1 } = route.params;

  const efficientie = 0.9;

  const doorgaan = () => {
    const vermogen = parseFloat(kritischVermogen);
    const tijd = parseFloat(backuptijd);

    console.log("Invoer → vermogen (kW):", vermogen, "tijd (uren):", tijd);
    console.log("Ontvangen benodigdKWh1 uit params:", benodigdKWh1);

    if (isNaN(vermogen) || isNaN(tijd)) {
      Alert.alert("Ongeldige invoer", "Vul beide velden correct in.");
      return;
    }

    const kWh2 = (vermogen * tijd) / efficientie;
    console.log("Berekend kWh2 (noodstroom):", kWh2.toFixed(2));

    navigation.navigate("ZakelijkEnergiehandelVraag", {
      benodigdKWh1: parseFloat(benodigdKWh1),
      benodigdKWh2: kWh2.toFixed(2),
    });
  };

  return (
    <View style={styles.container}>
      <ScreenBackground
        style={styles.background}
        imageStyle={styles.imageStyle} // 🔧 web-only tweak
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Noodstroomvoorziening</Text>

            <Text style={styles.label}>Benodigde capaciteit (kWh)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={kritischVermogen}
              onChangeText={setKritischVermogen}
            />

            <Text style={styles.label}>Backuptijd (uren)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={backuptijd}
              onChangeText={setBackuptijd}
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
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    resizeMode: "contain",
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3eaf4f",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    alignSelf: "flex-start",
    marginBottom: 8,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: "100%",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#f7941e",
    padding: 16,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
