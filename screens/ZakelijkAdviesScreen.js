import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import ScreenBackground from "../components/ScreenBackground";
import SaveAdviceButton from "../components/SaveAdviceButton";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ZakelijkAdviesScreen({ navigation, route }) {
  const { kwh1 = 0, kwh2 = 0, kwh3 = 0 } = route.params || {};

  console.log("Zakelijk Advies → kwh1:", kwh1, "kwh2:", kwh2, "kwh3:", kwh3);

  const k0 = kwh1 + kwh2 + kwh3;
  console.log("Totale behoefte (k0):", k0);

  let advies = "";
  let image = null;
  let specificatieScreen = "";
  let modulesTekst = "";
  let totaalGeadviseerdeCapaciteit = k0;

  if (k0 <= 64) {
    advies = "64 kWh batterij";
    image = require("../assets/64-KWH-ZAKELIJK.png");
    specificatieScreen = "Specificaties64";
    totaalGeadviseerdeCapaciteit = 64;
  } else if (k0 <= 96) {
    advies = "96 kWh batterij";
    image = require("../assets/96-KWH-ZAKELIJK.png");
    specificatieScreen = "Specificaties96";
    totaalGeadviseerdeCapaciteit = 96;
  } else if (k0 < 1800) {
    // 261 kWh basisbatterij modulair uitbreiden
    const eenheid = 261;
    const aantalEenheden = Math.ceil(k0 / eenheid); // totaal aantal 261-blokken
    const aantalModules = Math.max(aantalEenheden - 1, 0); // basis + modules
    totaalGeadviseerdeCapaciteit = aantalEenheden * eenheid;

    if (aantalModules === 0) {
      advies = "261 kWh batterij (modulair uitbreidbaar)";
    } else if (aantalModules === 1) {
      advies =
        "261 kWh batterij + 1 module van 261 kWh (modulair uitbreidbaar)";
    } else {
      advies = `261 kWh batterij + ${aantalModules} modules van 261 kWh (modulair uitbreidbaar)`;
    }

    image = require("../assets/261-KWH-ZAKELIJK.png");
    // Hier gebruikte je al Specificaties261, die houden we zo
    specificatieScreen = "Specificaties261";

    modulesTekst = `Totaal geadviseerde capaciteit: ${totaalGeadviseerdeCapaciteit} kWh (${aantalEenheden} × 261 kWh).`;
    console.log("Aantal 261-blokken (algemeen zakelijk):", aantalEenheden);
  } else if (k0 <= 2090) {
    advies = "2.09 MWh batterij (modulair uitbreidbaar)";
    image = require("../assets/2-MW-ZAKELIJK.png");
    specificatieScreen = "Specificaties209";
    totaalGeadviseerdeCapaciteit = 2090;
  } else {
    advies = "5.01 MWh batterij (modulair uitbreidbaar)";
    image = require("../assets/5-MW-ZAKELIJK.png");
    specificatieScreen = "Specificaties501";
    totaalGeadviseerdeCapaciteit = 5010;
  }

  console.log("Gekozen advies:", advies);
  console.log("Navigeren naar:", specificatieScreen);

  return (
    <View style={styles.container}>
      <ScreenBackground>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>Advies op maat</Text>

            <Text style={styles.text}>
              Benodigd vermogen: {k0.toFixed(2)} kWh
            </Text>
            <Text style={styles.text}>Aanbevolen oplossing: {advies}</Text>

            {modulesTekst !== "" && (
              <Text style={styles.text}>{modulesTekst}</Text>
            )}

            <Text style={styles.text}>
              Geadviseerde systeemcapaciteit: {totaalGeadviseerdeCapaciteit} kWh
            </Text>

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
                id: `zakelijk-${specificatieScreen}`,
                title: `Zakelijk advies: ${advies}`,
                summary: `Benodigd vermogen: ${k0.toFixed(
                  2
                )} kWh. Geadviseerde systeemcapaciteit: ${totaalGeadviseerdeCapaciteit} kWh. Oplossing: ${advies}${
                  modulesTekst ? `. ${modulesTekst}` : ""
                }`,
              }}
            />
          </ScrollView>
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
    alignSelf: "stretch",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
