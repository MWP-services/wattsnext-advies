// screens/ProductenScreen.js
import React, { useState } from "react";
import {
  useWindowDimensions,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";

import { sendProductQuoteEmail } from "../support/email";
import { db, auth } from "../firebaseConfig"; // ✅ we gebruiken auth hier echt
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const PRODUCTEN = [
  {
    artikelcode: "TBLV-0.5I",
    productId: "AS-5.12LDL-GL1",
    productnaam: "AS-5.12LD-GL1",
    categorie: "Thuis Batterij Laag Voltage",
    doelgroep: "Installateur",
    specs: "5 kWh",
  },
  {
    artikelcode: "AS-system accesoires-I",
    productId: "AS-system accesoires",
    productnaam: "AS-system accesoires",
    categorie: "Systeem accessoires",
    doelgroep: "Installateur",
    specs: "",
  },
  {
    artikelcode: "HO1-4.6-I",
    productId: "AH-4.6KSL-G2",
    productnaam: "AH-4.6KSL-G2",
    categorie: "Hybride Omvormer 1 fase",
    doelgroep: "Installateur",
    specs: "4.6 kW",
  },
  {
    artikelcode: "HO1-6-I",
    productId: "AH-6KSL-G2",
    productnaam: "AH-6KSL-G2",
    categorie: "Hybride Omvormer 1 fase",
    doelgroep: "Installateur",
    specs: "6 kW",
  },
  {
    artikelcode: "TBHV-2.5-I",
    productId: "AS-2.56HD-GL1",
    productnaam: "AS-2.56HD-GL1",
    categorie: "Thuis Batterij Hoog Voltage",
    doelgroep: "Installateur",
    specs: "2.5 kWh | Losse batterij unit",
  },
  {
    artikelcode: "TBHV-BMS-I",
    productId: "AS-2.56HD-GL1-Hbox",
    productnaam: "AS-2.56HD-GL1-Hbox",
    categorie: "Systeem accessoires",
    doelgroep: "Installateur",
    specs: "",
  },
  {
    artikelcode: "HO3-8-I",
    productId: "AH-8KTH-G1",
    productnaam: "AH-8KTH-G1",
    categorie: "Hybride Omvormer 3 fase",
    doelgroep: "Installateur",
    specs: "8 kW",
  },
  {
    artikelcode: "HO3-10-I",
    productId: "AH-10KTH-G1",
    productnaam: "AH-10KTH-G1",
    categorie: "Hybride Omvormer 3 fase",
    doelgroep: "Installateur",
    specs: "10 kW",
  },
  {
    artikelcode: "ZBA1TC-261-I",
    productId: "ES26/1125K-AEU",
    productnaam: "ES26/1125K-AEU",
    categorie: "All-in One Cabinet",
    doelgroep: "Installateur",
    specs: "261 kWh",
  },
  {
    artikelcode: "ZBA1IC-232-I",
    productId: "ES232/115K-AEU",
    productnaam: "ES232/115K-AEU",
    categorie: "All-in One Cabinet",
    doelgroep: "Installateur",
    specs: "232 kWh",
  },
  {
    artikelcode: "ZBSPCE-64-I",
    productId: "ES64/30K-AEU",
    productnaam: "ES64/30K-AEU",
    categorie: "Smart PV ESS Cabinet",
    doelgroep: "Installateur",
    specs: "64 kWh",
  },
  {
    artikelcode: "ZBSPCE-96-I",
    productId: "ES96/48K-AEU",
    productnaam: "ES96/48K-AEU",
    categorie: "Smart PV ESS Cabinet",
    doelgroep: "Installateur",
    specs: "96 kWh",
  },
  {
    artikelcode: "CCE-1250K-I",
    productId: "ES1250K/40VAC",
    productnaam: "ES1250K/40VAC",
    categorie: "Combiner Cabinet voor ESS",
    doelgroep: "Installateur",
    specs: "400 VAC",
  },
  {
    artikelcode: "CCE-400(-)I",
    productId: "ES1250K/400VAC",
    productnaam: "ES1250K/400VAC",
    categorie: "Combiner Cabinet voor ESS",
    doelgroep: "Installateur",
    specs: "400 VAC",
  },
  {
    artikelcode: "ZBA1ICE-2090-I",
    productId: "ES2090/1200K-AEU",
    productnaam: "ES2090/1200K-AEU",
    categorie: "All-in One ESS",
    doelgroep: "Installateur",
    specs: "2090 kWh",
  },
  {
    artikelcode: "ZBA1ICE-5015-I",
    productId: "ES5009/2580K-C/EU",
    productnaam: "ES5009/2580K-C/EU",
    categorie: "All-in-One ESS",
    doelgroep: "Installateur",
    specs: "5015 kWh",
  },
  {
    artikelcode: "TBHV-CB-I",
    productId: "ATS1200K-I",
    productnaam: "ATS1200K-I",
    categorie: "Thuis Batterij Hoog Voltage",
    doelgroep: "Installateur",
    specs: "",
  },
  {
    artikelcode: "ATS1200K-I",
    productId: "ATS",
    productnaam: "ATS",
    categorie: "ATS",
    doelgroep: "Installateur",
    specs: "400 VAC",
  },
  {
    artikelcode: "STS1250K-I",
    productId: "STS",
    productnaam: "STS",
    categorie: "STS",
    doelgroep: "Installateur",
    specs: "400VAC",
  },
  {
    artikelcode: "TBLV-PS-I",
    productId: "Power Sensor",
    productnaam: "Power Sensor",
    categorie: "Thuis Batterij Hoog Voltage",
    doelgroep: "Installateur",
    specs: "",
  },
  {
    artikelcode: "TBLV-PS-I",
    productId: "Power Sensor",
    productnaam: "Power Sensor",
    categorie: "Thuis Batterij Laag Voltage",
    doelgroep: "Installateur",
    specs: "",
  },
];

function ProductenScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const [sendingId, setSendingId] = useState(null);

  const handleQuoteRequest = async (product) => {
    if (sendingId) return;

    // check of er een user is
    const user = auth.currentUser;
    if (!user) {
      Alert.alert(
        "Inloggen vereist",
        "Je moet ingelogd zijn om een offerte aan te vragen."
      );
      return;
    }

    setSendingId(product.artikelcode);
    console.log("➡ Offerte-aanvraag gestart voor:", product.productnaam);

    try {
      // 1. Mail sturen
      const result = await sendProductQuoteEmail(product);
      console.log("📧 Mailresultaat:", result);

      // 2. Opslaan in Firestore mét uid (nodig voor rules)
      const docRef = await addDoc(collection(db, "quotes"), {
        uid: user.uid, // <- essentieel voor security rules
        artikelcode: product.artikelcode,
        productnaam: product.productnaam,
        categorie: product.categorie,
        doelgroep: product.doelgroep,
        specs: product.specs || "",
        status: "open",
        createdAt: serverTimestamp(),
      });

      console.log("✅ Quote opgeslagen in Firestore met id:", docRef.id);

      if (result && result.success) {
        Alert.alert(
          "Offerte aangevraagd",
          `Offerte aangevraagd voor ${product.productnaam}. Je ontvangt binnenkort een reactie.`
        );
      } else {
        Alert.alert(
          "Offerte aangemaakt",
          "De aanvraag is opgeslagen, maar de e-mail kon niet worden verstuurd."
        );
      }
    } catch (error) {
      console.error("❌ Offerte-aanvraag fout:", error);
      Alert.alert(
        "Fout",
        "Er ging iets mis bij het aanvragen van de offerte (opslaan of mail)."
      );
    } finally {
      setSendingId(null);
    }
  };

  const getCardWidth = () => {
    if (width > 1024) return "48%";
    if (width > 768) return "70%";
    return "100%";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require("../assets/achtergrond.png")}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageInner}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: width > 768 ? 48 : 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { fontSize: width > 768 ? 32 : 24 }]}>
            Producten voor installateurs
          </Text>

          {/* knop naar overzicht offertes */}
          <TouchableOpacity
            style={styles.overviewButton}
            onPress={() => navigation.navigate("Offertes")}
            accessibilityRole="button"
            accessibilityLabel="Ga naar mijn offerte-aanvragen"
          >
            <Text style={styles.overviewButtonText}>
              Mijn offerte-aanvragen →
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.productsWrapper,
              { flexDirection: width > 1024 ? "row" : "column" },
            ]}
          >
            {PRODUCTEN.map((product) => {
              const isSending = sendingId === product.artikelcode;
              const uniqueKey = `${product.artikelcode}-${product.categorie}`;

              return (
                <View
                  key={uniqueKey}
                  style={[
                    styles.productCard,
                    { width: getCardWidth() },
                  ]}
                >
                  <Text style={styles.productName}>
                    {product.productnaam}
                  </Text>

                  <Text style={styles.productMeta}>
                    Artikelcode: {product.artikelcode}
                  </Text>

                  <Text style={styles.productMeta}>
                    Categorie: {product.categorie}
                  </Text>

                  <Text style={styles.productMeta}>
                    Doelgroep: {product.doelgroep}
                  </Text>

                  {product.specs ? (
                    <Text style={styles.productMeta}>
                      Specificaties: {product.specs}
                    </Text>
                  ) : null}

                  <TouchableOpacity
                    style={[
                      styles.quoteButton,
                      isSending && styles.quoteButtonDisabled,
                    ]}
                    onPress={() => handleQuoteRequest(product)}
                    disabled={isSending}
                    accessibilityRole="button"
                    accessibilityLabel={`Vraag offerte aan voor ${product.productnaam}`}
                  >
                    <Text style={styles.quoteButtonText}>
                      {isSending ? "Bezig..." : "Vraag offerte aan"}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  backgroundImageInner: {
    resizeMode: Platform.OS === "web" ? "contain" : "cover",
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 32,
    paddingBottom: 48,
    alignItems: "center",
    gap: 24,
  },
  title: {
    fontWeight: "700",
    color: "#1f6f34",
    textAlign: "center",
  },
  overviewButton: {
    backgroundColor: "#f7941e",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  overviewButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  productsWrapper: {
    width: "100%",
    maxWidth: 960,
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 24,
  },
  productCard: {
    backgroundColor: "#ffffffee",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  productName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f1f1f",
    marginBottom: 8,
  },
  productMeta: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  quoteButton: {
    marginTop: 16,
    backgroundColor: "#f7941e",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  quoteButtonDisabled: {
    opacity: 0.5,
  },
  quoteButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default ProductenScreen;
