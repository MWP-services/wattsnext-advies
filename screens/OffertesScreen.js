// screens/OffertesScreen.js
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Platform,
} from "react-native";

import { auth, db } from "../firebaseConfig";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

export default function OffertesScreen({ navigation }) {
  const [aanvragen, setAanvragen] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // haal huidige user op
    const user = auth.currentUser;

    // als er geen user is → niks ophalen, lege lijst tonen
    if (!user) {
      console.log("❌ Geen gebruiker ingelogd, geen offertes ophalen");
      setAanvragen([]);
      setLoading(false);
      return;
    }

    console.log("🔎 Offertes ophalen voor uid:", user.uid);

    // query: alleen offertes van deze user
    const q = query(
      collection(db, "quotes"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        console.log("📥 Aantal offertes voor deze user:", snap.size);

        const list = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            artikelcode: data.artikelcode || "",
            productnaam: data.productnaam || "",
            categorie: data.categorie || "",
            specs: data.specs || "",
            status: data.status || "open",
            createdAt: data.createdAt ?? null,
          });
        });

        setAanvragen(list);
        setLoading(false);
      },
      (err) => {
        console.error("❌ Fout bij ophalen offertes:", err);
        setAanvragen([]);
        setLoading(false);
      }
    );

    return () => {
      unsub();
    };
  }, []); // <- we gebruiken auth.currentUser alleen bij mount

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require("../assets/achtergrond.png")}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageInner}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Titel */}
          <Text style={styles.title}>Mijn offerte-aanvragen</Text>

          {/* Terug naar producten */}
          <TouchableOpacity
            style={styles.backToProductsButton}
            onPress={() => navigation.navigate("Producten")}
            accessibilityRole="button"
            accessibilityLabel="Ga terug naar producten"
          >
            <Text style={styles.backToProductsButtonText}>
              ← Terug naar producten
            </Text>
          </TouchableOpacity>

          {/* Status info */}
          {loading ? (
            <Text style={styles.subtleText}>Offertes laden…</Text>
          ) : aanvragen.length === 0 ? (
            <Text style={styles.subtleText}>
              Je hebt nog geen offerte-aanvragen gedaan.
            </Text>
          ) : null}

          {/* Lijst met aangevraagde offertes */}
          <View style={styles.listWrapper}>
            {aanvragen.map((aanvraag) => (
              <View key={aanvraag.id} style={styles.offerteCard}>
                <Text style={styles.cardTitle}>
                  {aanvraag.productnaam || "Onbekend product"}
                </Text>

                <Text style={styles.cardMeta}>
                  Artikelcode: {aanvraag.artikelcode || "-"}
                </Text>

                <Text style={styles.cardMeta}>
                  Categorie: {aanvraag.categorie || "-"}
                </Text>

                {aanvraag.specs ? (
                  <Text style={styles.cardMeta}>
                    Specificaties: {aanvraag.specs}
                  </Text>
                ) : null}

                <Text style={styles.cardStatus}>
                  Status:{" "}
                  <Text style={styles.cardStatusValue}>
                    {aanvraag.status || "open"}
                  </Text>
                </Text>

                {/* createdAt tonen als datum/tijd (optioneel) */}
                {aanvraag.createdAt && aanvraag.createdAt.seconds ? (
                  <Text style={styles.cardTimestamp}>
                    Aangevraagd op:{" "}
                    {new Date(
                      aanvraag.createdAt.seconds * 1000
                    ).toLocaleString()}
                  </Text>
                ) : (
                  <Text style={styles.cardTimestamp}>
                    Aangevraagd op: onbekend
                  </Text>
                )}
              </View>
            ))}
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
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f6f34", // zelfde groen
    textAlign: "center",
  },

  backToProductsButton: {
    backgroundColor: "#f7941e", // zelfde oranje
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  backToProductsButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },

  subtleText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    opacity: 0.8,
  },

  listWrapper: {
    width: "100%",
    maxWidth: 800,
    gap: 16,
  },

  offerteCard: {
    backgroundColor: "#ffffffee",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f1f1f",
    marginBottom: 6,
  },
  cardMeta: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  cardStatus: {
    fontSize: 16,
    color: "#1f1f1f",
    fontWeight: "600",
    marginTop: 8,
  },
  cardStatusValue: {
    color: "#f7941e",
    fontWeight: "700",
  },
  cardTimestamp: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
  },
});
