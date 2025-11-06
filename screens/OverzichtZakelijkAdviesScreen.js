import React, { useCallback, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import SaveAdviceButton from "../components/SaveAdviceButton";
import ScreenBackground from "../components/ScreenBackground";

export default function OverzichtZakelijkAdviesScreen({ route, navigation }) {
  const { kwh1, kwh2, energiehandel } = route.params;

  const [showEmailFormat, setShowEmailFormat] = useState(false);

  const kwhTotaal = (Number(kwh1) || 0) + (Number(kwh2) || 0);

  // Zakelijk aanbod (alle hoog voltage)
  const zakelijkeOpties = [
    {
      capaciteit: 7.5,
      naam: "7.5 kWh Zakelijk",
      afbeelding: require("../assets/7.5-KWH-ADVIES.jpg"),
    },
    {
      capaciteit: 10,
      naam: "10 kWh Zakelijk",
      afbeelding: require("../assets/10-KWH-ADVIES.jpg"),
    },
    {
      capaciteit: 12.5,
      naam: "12.5 kWh Zakelijk",
      afbeelding: require("../assets/12.5-KWH-ADVIES.jpg"),
    },
    {
      capaciteit: 15,
      naam: "15 kWh Zakelijk",
      afbeelding: require("../assets/15-KWH-ADVIES.jpg"),
    },
    {
      capaciteit: 17.5,
      naam: "17.5 kWh Zakelijk",
      afbeelding: require("../assets/17.5-KWH-ADVIES.jpg"),
    },
    {
      capaciteit: 20,
      naam: "20 kWh Zakelijk",
      afbeelding: require("../assets/20-KWH-ADVIES.jpg"),
    },
  ];

  const gekozen = zakelijkeOpties.find(
    (optie) => kwhTotaal <= optie.capaciteit,
  ) || {
    naam: "Meer dan 20 kWh nodig",
    afbeelding: null,
  };

  const adviesId = useMemo(() => {
    if (!gekozen.naam) {
      return "zakelijk-overzicht";
    }

    return `zakelijk-overzicht-${gekozen.naam.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  }, [gekozen.naam]);

  const emailSubject = useMemo(
    () => "Afspraak inplannen - Wattsnext zakelijk advies",
    [],
  );

  const emailBody = useMemo(() => {
    const regels = [
      "Beste Rick,",
      "",
      "Graag plan ik een afspraak in om het volgende zakelijk energieopslagadvies te bespreken:",
      `- Benodigd totaal vermogen: ${kwhTotaal.toFixed(1)} kWh`,
      `- Aanbevolen oplossing: ${gekozen.naam}`,
    ];

    if (energiehandel) {
      regels.push(`- Energiehandel gewenst: ${energiehandel}`);
    }

    regels.push(
      "",
      "Laat me weten welke momenten voor jou passen, dan prik ik graag een afspraak.",
      "",
      "Met vriendelijke groet,",
      "[Je naam]",
    );

    return regels.join("\n");
  }, [energiehandel, gekozen.naam, kwhTotaal]);

  const mailtoLink = useMemo(
    () =>
      `mailto:r.oskam@wattsnext.energy?subject=${encodeURIComponent(
        emailSubject,
      )}&body=${encodeURIComponent(emailBody)}`,
    [emailBody, emailSubject],
  );

  const handleOpenEmail = useCallback(async () => {
    try {
      await Linking.openURL(mailtoLink);
    } catch (error) {
      Alert.alert(
        "E-mail openen mislukt",
        "Open je mailapp en stuur Rick handmatig via r.oskam@wattsnext.energy.",
      );
    }
  }, [mailtoLink]);

  return (
    <View style={styles.container}>
      <ScreenBackground
        style={styles.background}
        imageStyle={styles.imageStyle} // 🔧 web-only tweak
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Zakelijk Advies</Text>
          <Text style={styles.subtext}>
            Benodigd totaal: {kwhTotaal.toFixed(1)} kWh
          </Text>

          {gekozen.afbeelding && (
            <Image
              source={gekozen.afbeelding}
              style={styles.image}
              resizeMode="contain"
            />
          )}

          <Text style={styles.advies}>{gekozen.naam}</Text>

          {energiehandel && (
            <Text style={styles.subtext}>
              Energiehandel gewenst: {energiehandel}
            </Text>
          )}

          <SaveAdviceButton
            advice={{
              id: adviesId,
              title: `Zakelijk advies overzicht: ${gekozen.naam}`,
              summary: `Totaal vermogen: ${kwhTotaal.toFixed(1)} kWh.${
                energiehandel ? ` Energiehandel: ${energiehandel}.` : ""
              }`,
            }}
          />

          <TouchableOpacity
            style={[styles.button, styles.emailButton]}
            onPress={() => setShowEmailFormat((value) => !value)}
          >
            <Text style={styles.buttonText}>
              {showEmailFormat ? "Verberg e-mailformat" : "Toon e-mailformat"}
            </Text>
          </TouchableOpacity>

          {showEmailFormat && (
            <View style={styles.emailCard}>
              <Text style={styles.emailTitle}>Mail Rick Oskam</Text>
              <Text style={styles.emailAddress}>r.oskam@wattsnext.energy</Text>
              <Text style={styles.emailText}>{emailBody}</Text>

              <TouchableOpacity
                style={[styles.button, styles.mailButton]}
                onPress={handleOpenEmail}
              >
                <Text style={styles.buttonText}>Open e-mail</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.buttonText}>Terug naar begin</Text>
          </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#3eaf4f",
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    marginBottom: 10,
  },
  advies: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f7941e",
    marginVertical: 20,
    textAlign: "center",
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#f7941e",
    padding: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  emailButton: {
    backgroundColor: "#3eaf4f",
  },
  mailButton: {
    backgroundColor: "#1f6f34",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  emailCard: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
  },
  emailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#3eaf4f",
    textAlign: "center",
  },
  emailAddress: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  emailText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
});
