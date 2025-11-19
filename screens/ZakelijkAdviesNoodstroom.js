import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import SaveAdviceButton from "../components/SaveAdviceButton";
import ScreenBackground from "../components/ScreenBackground";

export default function ZakelijkAdviesNoodstroom({ route, navigation }) {
  const { kwh1 = 0, kwh2 = 0 } = route.params || {};
  const totaalKwh = kwh1; // Noodstroomadvies is gebaseerd op kwh1

  console.log("Noodstroom Advies → kwh1:", kwh1, "kwh2:", kwh2);
  console.log("Totale behoefte:", totaalKwh);

  let advies = "";
  let afbeelding = null;
  let specificatieScreen = "";
  let modulesTekst = "";
  let totaalGeadviseerdeCapaciteit = totaalKwh;

  if (totaalKwh <= 64) {
    advies = "64 kWh batterij";
    afbeelding = require("../assets/64-KWH-ZAKELIJK.png");
    specificatieScreen = "Specificaties64";
    totaalGeadviseerdeCapaciteit = 64;
  } else if (totaalKwh <= 96) {
    advies = "96 kWh batterij";
    afbeelding = require("../assets/96-KWH-ZAKELIJK.png");
    specificatieScreen = "Specificaties96";
    totaalGeadviseerdeCapaciteit = 96;
  } else if (totaalKwh < 1800) {
    // 261 kWh basisbatterij modulair uitbreiden
    const eenheid = 261;
    const aantalEenheden = Math.ceil(totaalKwh / eenheid); // totaal aantal 261-blokken
    const aantalModules = Math.max(aantalEenheden - 1, 0); // basis + modules
    totaalGeadviseerdeCapaciteit = aantalEenheden * eenheid;

    if (aantalModules === 0) {
      advies = "261 kWh batterij";
    } else if (aantalModules === 1) {
      advies = "261 kWh batterij + 1 module van 261 kWh";
    } else {
      advies = `261 kWh batterij + ${aantalModules} modules van 261 kWh`;
    }

    afbeelding = require("../assets/261-KWH-ZAKELIJK.png");
    // Voor Noodstroom gebruikte je al Specificaties232 voor 261 kWh, die houden we aan
    specificatieScreen = "Specificaties232";

    modulesTekst = `Totaal geadviseerde capaciteit: ${totaalGeadviseerdeCapaciteit} kWh (${aantalEenheden} × 261 kWh).`;
    console.log("Aantal 261-blokken (noodstroom):", aantalEenheden);
  } else if (totaalKwh <= 2090) {
    advies = "2.09 MWh batterij (modulair uitbreidbaar)";
    afbeelding = require("../assets/2-MW-ZAKELIJK.png");
    specificatieScreen = "Specificaties209";
    totaalGeadviseerdeCapaciteit = 2090;
  } else {
    advies = "5.01 MWh batterij";
    afbeelding = require("../assets/5-MW-ZAKELIJK.png");
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
            <Text style={styles.title}>Advies Noodstroomvoorziening</Text>

            <Text style={styles.result}>
              Benodigde opslagcapaciteit: {totaalKwh.toFixed(1)} kWh
            </Text>
            <Text style={styles.result}>Aanbevolen oplossing: {advies}</Text>

            {modulesTekst !== "" && (
              <Text style={styles.result}>{modulesTekst}</Text>
            )}

            <Text style={styles.result}>
              Geadviseerde systeemcapaciteit: {totaalGeadviseerdeCapaciteit} kWh
            </Text>

            {afbeelding && (
              <Image
                source={afbeelding}
                style={styles.image}
                resizeMode="contain"
              />
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate(specificatieScreen)}
            >
              <Text style={styles.buttonText}>Bekijk specificaties</Text>
            </TouchableOpacity>

            <SaveAdviceButton
              advice={{
                id: `zakelijk-noodstroom-${specificatieScreen}`,
                title: `Noodstroom advies: ${advies}`,
                summary: `Benodigde opslagcapaciteit: ${totaalKwh.toFixed(
                  1
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
    color: "#4CAF50",
    textAlign: "center",
  },
  result: {
    fontSize: 16,
    marginVertical: 8,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 250,
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#f7941e",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    alignSelf: "stretch",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
