// screens/LoadShiftingEnergiehandelVraagScreen.js
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
export default function LoadShiftingEnergiehandelVraagScreen({
  navigation,
  route,
}) {
  const { kwh1 = 0, kwh2 = 0 } = route.params || {};

  const [wiltHandelen, setWiltHandelen] = useState(null);
  const [pnet, setPnet] = useState("");
  const [pgewenst, setPgewenst] = useState("");

  const handleNext = () => {
    const net = parseFloat(pnet);
    const gewenst = parseFloat(pgewenst);

    if (isNaN(net) || isNaN(gewenst) || net <= 0 || gewenst <= 0) {
      alert("Vul geldige waarden in.");
      return;
    }

    if (gewenst > net * 2) {
      alert(
        "De gewenste handelscapaciteit mag niet meer dan 2x de netaansluiting zijn.",
      );
      return;
    }

    const kwh3 = gewenst;

    console.log("[LoadShifting] handleNext");
    console.log("kwh1:", kwh1);
    console.log("kwh2:", kwh2);
    console.log("kwh3:", kwh3);

    navigation.navigate("ZakelijkAdviesLoadShifting", { kwh1, kwh2, kwh3 });
  };

  const handleNee = () => {
    const kwh3 = 0;

    console.log("[LoadShifting] handleNee");
    console.log("kwh1:", kwh1);
    console.log("kwh2:", kwh2);
    console.log("kwh3:", kwh3);

    navigation.navigate("ZakelijkAdviesLoadShifting", { kwh1, kwh2, kwh3 });
  };

  return (
    <View style={styles.container}>
      <ScreenBackground
        style={styles.background}
        imageStyle={styles.imageStyle} // 🔧 web-only tweak
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
            <Text style={styles.title}>
              Wilt u handelen op de energiemarkt?
            </Text>

            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  wiltHandelen === true && styles.toggleSelected,
                ]}
                onPress={() => setWiltHandelen(true)}
              >
                <Text style={styles.toggleText}>Ja</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  wiltHandelen === false && styles.toggleSelected,
                ]}
                onPress={handleNee}
              >
                <Text style={styles.toggleText}>Nee</Text>
              </TouchableOpacity>
            </View>

            {wiltHandelen === true && (
              <>
                <Text style={styles.label}>
                  Maximaal netaansluitingsvermogen (kW)
                </Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={pnet}
                  onChangeText={setPnet}
                  placeholder="Bijv. 20"
                  placeholderTextColor="#aaa"
                />

                <Text style={styles.label}>
                  Gewenste handelscapaciteit (kWh)
                </Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={pgewenst}
                  onChangeText={setPgewenst}
                  placeholder="Bijv. 15"
                  placeholderTextColor="#aaa"
                />

                <TouchableOpacity style={styles.button} onPress={handleNext}>
                  <Text style={styles.buttonText}>Ga verder</Text>
                </TouchableOpacity>
              </>
            )}
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
    padding: 24,
    justifyContent: "center",
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
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#FF7F00",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  toggleButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginHorizontal: 10,
    backgroundColor: "#f9f9f9",
    minWidth: 100,
    alignItems: "center",
  },
  toggleSelected: {
    backgroundColor: "#4CAF50",
  },
  toggleText: {
    color: "#000",
    fontSize: 16,
  },
});
