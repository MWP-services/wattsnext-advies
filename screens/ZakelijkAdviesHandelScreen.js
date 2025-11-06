import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import ScreenBackground from "../components/ScreenBackground";
import SaveAdviceButton from "../components/SaveAdviceButton";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ZakelijkAdviesHandelScreen({ route, navigation }) {
  const { kwh1, kwh2 = 0 } = route.params;
  const totaleBehoefte = kwh1 + kwh2;

  console.log("Ontvangen kwh1:", kwh1);
  console.log("Ontvangen kwh2:", kwh2);
  console.log("Totale behoefte:", totaleBehoefte);

  let advies = "";
  let specificatieScreen = "";

  if (totaleBehoefte <= 64) {
    advies = "64 kWh batterij";
    specificatieScreen = "Specificaties64";
  } else if (totaleBehoefte <= 96) {
    advies = "96 kWh batterij";
    specificatieScreen = "Specificaties96";
  } else if (totaleBehoefte <= 232) {
    advies = "232 kWh batterij (modulair uitbreidbaar)";
    specificatieScreen = "Specificaties232";
  } else if (totaleBehoefte <= 2090) {
    advies = "2.09 MWh batterij (modulair uitbreidbaar)";
    specificatieScreen = "Specificaties209";
  } else {
    advies = "5.01 MWh batterij (modulair uitbreidbaar)";
    specificatieScreen = "Specificaties501";
  }

  console.log("Gekozen advies:", advies);
  console.log("Navigeren naar scherm:", specificatieScreen);

  return (
    <View style={styles.container}>
      <ScreenBackground>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>Advies - Handel op energiemarkt</Text>
          <Text style={styles.info}>
            Totale energiebehoefte: {totaleBehoefte.toFixed(2)} kWh
          </Text>
          <Text style={styles.advice}>{advies}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(specificatieScreen)}
          >
            <Text style={styles.buttonText}>Bekijk specificaties</Text>
          </TouchableOpacity>

          <SaveAdviceButton
            advice={{
              id: `zakelijk-handel-${specificatieScreen}`,
              title: `Energiehandel advies: ${advies}`,
              summary: `Totale energiebehoefte: ${totaleBehoefte.toFixed(2)} kWh. Aanbevolen oplossing: ${advies}.`,
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
    color: "#4CAF50",
    marginBottom: 20,
    textAlign: "center",
  },
  info: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: "center",
  },
  advice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f7941e",
    marginBottom: 30,
    textAlign: "center",
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
