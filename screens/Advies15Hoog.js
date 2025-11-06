import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import ScreenBackground from "../components/ScreenBackground";
import SaveAdviceButton from "../components/SaveAdviceButton";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Advies15Hoog({ navigation }) {
  return (
    <View style={styles.container}>
      <ScreenBackground
        style={styles.background}
        imageStyle={styles.imageStyle} // 🔧 web-only tweak
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
          <Text style={styles.title}>Persoonlijk Advies</Text>
          <Text style={styles.text}>
            Op basis van uw gegevens adviseert WattsNext:
          </Text>
          <Text style={styles.advice}>
            15 kWh batterijopslag (Hoog Voltage)
          </Text>

          <Image
            source={require("../assets/15-KWH-ADVIES.jpg")}
            style={styles.image}
          />

          <TouchableOpacity
            style={styles.specButton}
            onPress={() => navigation.navigate("Spec_HV_particulier")}
          >
            <Text style={styles.specButtonText}>Bekijk specificaties</Text>
          </TouchableOpacity>

          <SaveAdviceButton
            advice={{
              id: "particulier-15kwh-hoog",
              title: "Advies 15 kWh (Hoog Voltage)",
              summary:
                "Advies voor 15 kWh batterijopslag met hoog voltage configuratie.",
            }}
          />
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
  content: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3eaf4f",
    marginBottom: 16,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  advice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f7941e",
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: 370,
    height: 400,
    marginBottom: -20,
  },
  specButton: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#3eaf4f",
    borderRadius: 8,
  },
  specButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
