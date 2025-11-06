import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import SaveAdviceButton from "../components/SaveAdviceButton";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenBackground from "../components/ScreenBackground";

export default function Advies10Laag({ navigation }) {
  return (
    <View style={styles.container}>
      <ScreenBackground>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
          <Text style={styles.title}>Persoonlijk Advies</Text>
          <Text style={styles.text}>
            Op basis van uw gegevens adviseert WattsNext:
          </Text>
          <Text style={styles.advice}>
            10 kWh batterijopslag (Laag Voltage)
          </Text>

          <Image
            source={require("../assets/10-KWH-ADVIES-LAAG.jpg")}
            style={styles.image}
            resizeMode="contain"
          />

          <TouchableOpacity
            style={styles.specButton}
            onPress={() => navigation.navigate("Spec_LV_particulier")}
          >
            <Text style={styles.specButtonText}>Bekijk specificaties</Text>
          </TouchableOpacity>

          <SaveAdviceButton
            advice={{
              id: "particulier-10kwh-laag",
              title: "Advies 10 kWh (Laag Voltage)",
              summary:
                "Advies voor 10 kWh batterijopslag met laag voltage configuratie.",
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
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignSelf: "center",
    width: "100%",
    maxWidth: 1200,
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
