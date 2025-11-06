// screens/OffertesScreen.js
import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth, db } from "../firebaseConfig";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import ScreenBackground from "../components/ScreenBackground";

export default function OffertesScreen({ navigation }) {
  const [aanvragen, setAanvragen] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setAanvragen([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "quotes"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            type: data.type || "single",
            artikelcode: data.artikelcode || "",
            productnaam: data.productnaam || "",
            categorie: data.categorie || "",
            specs: data.specs || "",
            qty: typeof data.qty === "number" ? data.qty : 1, // ✅ single qty (default 1)
            items: Array.isArray(data.items) ? data.items : null, // multi
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
      },
    );

    return () => unsub();
  }, []);

  const sumQty = (items) =>
    Array.isArray(items) ? items.reduce((acc, it) => acc + (Number(it?.qty) || 1), 0) : 0;

  return (
    <View style={styles.container}>
      <ScreenBackground
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageInner}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
          <Text style={styles.title}>Mijn offerte-aanvragen</Text>

          <TouchableOpacity
            style={styles.backToProductsButton}
            onPress={() => navigation.navigate("Producten")}
          >
            <Text style={styles.backToProductsButtonText}>
              ← Terug naar producten
            </Text>
          </TouchableOpacity>

          {loading ? (
            <Text style={styles.subtleText}>Offertes laden…</Text>
          ) : aanvragen.length === 0 ? (
            <Text style={styles.subtleText}>
              Je hebt nog geen offerte-aanvragen gedaan.
            </Text>
          ) : null}

          <View style={styles.listWrapper}>
            {aanvragen.map((aanvraag) => {
              const ts = aanvraag.createdAt?.seconds
                ? new Date(aanvraag.createdAt.seconds * 1000).toLocaleString()
                : "onbekend";

              const isMulti =
                Array.isArray(aanvraag.items) && aanvraag.items.length > 0;

              const totalStuks = isMulti ? sumQty(aanvraag.items) : aanvraag.qty || 1;

              return (
                <View key={aanvraag.id} style={styles.offerteCard}>
                  <Text style={styles.cardTitle}>
                    {isMulti
                      ? `Batch-aanvraag (${aanvraag.items.length} producten, ${totalStuks} stuks)`
                      : aanvraag.productnaam || "Onbekend product"}
                  </Text>

                  {!isMulti ? (
                    <>
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
                      <Text style={styles.cardMeta}>
                        Aantal: {aanvraag.qty || 1} {/* ✅ toon qty bij single */}
                      </Text>
                    </>
                  ) : (
                    <View style={styles.itemsWrapper}>
                      {aanvraag.items.map((it, idx) => (
                        <View
                          key={`${aanvraag.id}-${idx}`}
                          style={styles.itemRow}
                        >
                          <Text style={styles.itemBullet}>•</Text>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.itemLine}>
                              {it.productnaam || "Product"}{" "}
                              <Text style={styles.itemDim}>
                                ({it.artikelcode || "-"})
                              </Text>
                            </Text>
                            <Text style={styles.itemSub}>
                              {it.categorie || "-"} {it.specs ? `| ${it.specs}` : ""}
                            </Text>
                            <Text style={styles.itemSub}>
                              Aantal: {Number(it?.qty) || 1} {/* ✅ toon qty per item */}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  <Text style={styles.cardStatus}>
                    Status:{" "}
                    <Text style={styles.cardStatusValue}>
                      {aanvraag.status || "open"}
                    </Text>
                  </Text>
                  <Text style={styles.cardTimestamp}>Aangevraagd op: {ts}</Text>
                </View>
              );
            })}
          </View>
          </ScrollView>
        </SafeAreaView>
      </ScreenBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: "relative" },
  safeArea: { flex: 1, backgroundColor: "#f0f4f8" },
  backgroundImage: { flex: 1, width: "100%", height: "100%" },
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
    color: "#1f6f34",
    textAlign: "center",
  },
  backToProductsButton: {
    backgroundColor: "#f7941e",
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
  listWrapper: { width: "100%", maxWidth: 800, gap: 16 },

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
  cardMeta: { fontSize: 16, color: "#333", marginBottom: 4 },
  cardStatus: {
    fontSize: 16,
    color: "#1f1f1f",
    fontWeight: "600",
    marginTop: 8,
  },
  cardStatusValue: { color: "#f7941e", fontWeight: "700" },
  cardTimestamp: { fontSize: 14, color: "#555", marginTop: 6 },

  // multi items
  itemsWrapper: { marginTop: 4, marginBottom: 6, gap: 8 },
  itemRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  itemBullet: { color: "#1f6f34", fontSize: 18, marginTop: -2 },
  itemLine: { fontSize: 16, color: "#1f1f1f", fontWeight: "600" },
  itemDim: { color: "#555", fontWeight: "400" },
  itemSub: { fontSize: 14, color: "#444" },
});
