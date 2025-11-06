import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import ScreenBackground from "../components/ScreenBackground";

export default function PersoonsgegevensScreen({ navigation }) {
  const route = useRoute();
  const aansluiting = route.params?.aansluiting;

  const [verbruik, setVerbruik] = useState("");
  const [vermogenWp, setVermogenWp] = useState("");
  const [aantalPanelen, setAantalPanelen] = useState("");

  const doorgaan = () => {
    navigation.navigate("Advies", {
      verbruik,
      vermogenWp,
      aantalPanelen,
      aansluiting,
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
              <Text style={styles.title}>Vul je gegevens in</Text>

            <Text style={styles.label}>Jaarlijks stroomverbruik (kWh)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={verbruik}
              onChangeText={setVerbruik}
              placeholder="Bijv. 3500"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Vermogen per zonnepaneel (Wp)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={vermogenWp}
              onChangeText={setVermogenWp}
              placeholder="Bijv. 400"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Aantal zonnepanelen</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={aantalPanelen}
              onChangeText={setAantalPanelen}
              placeholder="Bijv. 10"
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
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3eaf4f",
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    alignSelf: "flex-start",
    marginBottom: 5,
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
