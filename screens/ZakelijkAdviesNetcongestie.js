import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import SaveAdviceButton from "../components/SaveAdviceButton";
import ScreenBackground from "../components/ScreenBackground";

export default function ZakelijkAdviesNetcongestie({ navigation, route }) {
  const { kwh1, kwh2 = 0, kwh3 = 0 } = route.params;
  const totaleBehoefte = kwh1 + kwh2 + kwh3;

  console.log(
    "Netcongestie Advies -> kwh1:",
    kwh1,
    "kwh2:",
    kwh2,
    "kwh3:",
    kwh3,
  );
  console.log("Totale behoefte:", totaleBehoefte);

  let advies = "";
  let image = null;
  let specificatieScreen = "";

  if (totaleBehoefte <= 64) {
    advies = "64 kWh batterij";
    image = require("../assets/64-KWH-ZAKELIJK.png");
    specificatieScreen = "Specificaties64";
  } else if (totaleBehoefte <= 96) {
    advies = "96 kWh batterij";
    image = require("../assets/96-KWH-ZAKELIJK.png");
    specificatieScreen = "Specificaties96";
  } else if (totaleBehoefte <= 232) {
    advies = "232 kWh batterij (modulair uitbreidbaar)";
    image = require("../assets/232-KWH-ZAKELIJK.png");
    specificatieScreen = "Specificaties232";
  } else if (totaleBehoefte <= 2090) {
    advies = "2.09 MWh batterij (modulair uitbreidbaar)";
    image = require("../assets/2-MW-ZAKELIJK.png");
    specificatieScreen = "Specificaties209";
  } else {
    advies = "5.01 MWh batterij (modulair uitbreidbaar)";
    image = require("../assets/5-MW-ZAKELIJK.png");
    specificatieScreen = "Specificaties501";
  }

  console.log("Gekozen advies:", advies);
  console.log("Navigeren naar:", specificatieScreen);

  return (
    <ScreenBackground
      style={styles.background}
      imageStyle={styles.imageStyle} // 🔧 web-only tweak
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Advies Netcongestie</Text>
          <Text style={styles.text}>
            Benodigd vermogen: {totaleBehoefte.toFixed(2)} kWh
          </Text>
          <Text style={styles.text}>Aanbevolen oplossing: {advies}</Text>

          {image && (
            <Image source={image} style={styles.image} resizeMode="contain" />
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(specificatieScreen)}
          >
            <Text style={styles.buttonText}>Bekijk specificaties</Text>
          </TouchableOpacity>

          <SaveAdviceButton
            advice={{
              id: `zakelijk-netcongestie-${specificatieScreen}`,
              title: `Netcongestie advies: ${advies}`,
              summary: `Benodigd vermogen: ${totaleBehoefte.toFixed(2)} kWh. Aanbevolen oplossing: ${advies}.`,
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#4CAF50",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 250,
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#FF7F00",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
