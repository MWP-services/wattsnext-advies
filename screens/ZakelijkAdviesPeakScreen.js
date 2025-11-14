import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import ScreenBackground from "../components/ScreenBackground";
import SaveAdviceButton from "../components/SaveAdviceButton";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ZakelijkAdviesPeakScreen({ route, navigation }) {
  const { kwh1 = 0, kwh2 = 0, kwh3 = 0 } = route.params || {};

  const totaleBehoefteOrigineel = kwh1 + kwh2 + kwh3;
  const totaleBehoefte = totaleBehoefteOrigineel * 2; // ✨ Keer 2 voor peak shaving

  console.log("Peak Advies → kwh1:", kwh1, "kwh2:", kwh2, "kwh3:", kwh3);
  console.log("Totale behoefte (origineel):", totaleBehoefteOrigineel);
  console.log("Totale behoefte (x2):", totaleBehoefte);

  let advies = "";
  let image = null;
  let specificatieScreen = "";
  let modulesTekst = "";
  let totaalGeadviseerdeCapaciteit = totaleBehoefte;

  if (totaleBehoefte <= 64) {
    advies = "64 kWh batterij";
    image = require("../assets/64-KWH-ZAKELIJK.png");
    specificatieScreen = "Specificaties64";
    totaalGeadviseerdeCapaciteit = 64;
  } else if (totaleBehoefte <= 96) {
    advies = "96 kWh batterij";
    image = require("../assets/96-KWH-ZAKELIJK.png");
    specificatieScreen = "Specificaties96";
    totaalGeadviseerdeCapaciteit = 96;
  } else if (totaleBehoefte < 1800) {
    // 261 kWh basisbatterij modulair uitbreiden
    const eenheid = 261;
    const aantalEenheden = Math.ceil(totaleBehoefte / eenheid); // totaal aantal 261-blokken
    const aantalModules = Math.max(aantalEenheden - 1, 0); // basis + modules
    totaalGeadviseerdeCapaciteit = aantalEenheden * eenheid;

    if (aantalModules === 0) {
      advies = "261 kWh batterij";
    } else if (aantalModules === 1) {
      advies = "261 kWh batterij + 1 module van 261 kWh";
    } else {
      advies = `261 kWh batterij + ${aantalModules} modules van 261 kWh`;
    }

    image = require("../assets/261-KWH-ZAKELIJK.png");
    // Je gebruikte hier eerder Specificaties232 voor 261 kWh, die houden we zo
    specificatieScreen = "Specificaties232";

    modulesTekst = `Totaal geadviseerde capaciteit: ${totaalGeadviseerdeCapaciteit} kWh (${aantalEenheden} × 261 kWh).`;
    console.log("Aantal 261-blokken (peak):", aantalEenheden);
  } else if (totaleBehoefte <= 2090) {
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
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.content}
          >
            <Text style={styles.title}>Advies op maat</Text>

            <Text style={styles.info}>
              Totale energiebehoefte (voor peak shaving):{" "}
              {totaleBehoefte.toFixed(1)} kWh
            </Text>

            <Text style={styles.advice}>{advies}</Text>

            {modulesTekst !== "" && (
              <Text style={styles.info}>{modulesTekst}</Text>
            )}

            <Text style={styles.info}>
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
                id: `zakelijk-peak-${specificatieScreen}`,
                title: `Peak advies: ${advies}`,
                summary: `Totale energiebehoefte (voor peak shaving): ${totaleBehoefte.toFixed(
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
    minHeight: "100%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 20,
    textAlign: "center",
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  advice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f7941e",
    marginBottom: 20,
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
    alignSelf: "stretch",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
