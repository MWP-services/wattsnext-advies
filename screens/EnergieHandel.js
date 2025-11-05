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

export default function EnergieHandel({ navigation }) {
  const [vermogen, setVermogen] = useState("");
  const [teruglever, setTeruglever] = useState("");
  const [wiltNoodstroom, setWiltNoodstroom] = useState(null);

  const handleNext = () => {
    const teruglevering = parseFloat(teruglever);

    if (isNaN(teruglevering) || teruglevering <= 0) {
      alert("Vul een geldige teruglevercapaciteit in.");
      return;
    }

    const kwh1 = teruglevering * 2;

    console.log("Gecontracteerd terugleververmogen (kW):", teruglevering);
    console.log("Berekening kwh1 = teruglever × 2:", kwh1);

    if (wiltNoodstroom === true) {
      navigation.navigate("HandelNoodstroomVraag", { kwh1 });
    } else {
      navigation.navigate("ZakelijkAdviesHandel", { kwh1, kwh2: 0 });
    }
  };

  return (
    <ScreenBackground style={styles.background} imageStyle={styles.imageStyle}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={80}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Handel op de energiemarkt</Text>

            <Text style={styles.label}>Gecontracteerd vermogen (kW)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={vermogen}
              onChangeText={setVermogen}
              placeholder="Bijv. 20"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>
              Gecontracteerd terugleververmogen (kW)
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={teruglever}
              onChangeText={setTeruglever}
              placeholder="Bijv. 15"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>
              Wilt u ruimte reserveren voor noodstroomvoorziening?
            </Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  wiltNoodstroom === true && styles.toggleSelected,
                ]}
                onPress={() => setWiltNoodstroom(true)}
              >
                <Text style={styles.toggleText}>Ja</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  wiltNoodstroom === false && styles.toggleSelected,
                ]}
                onPress={() => setWiltNoodstroom(false)}
              >
                <Text style={styles.toggleText}>Nee</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Ga verder</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    resizeMode: "contain",
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  container: {
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
