// screens/WinkelmandjeScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenBackground from "../components/ScreenBackground";

import { sendProductQuoteEmail } from "../support/email";
import { auth, db } from "../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function WinkelmandjeScreen({ navigation, route }) {
  const params = route?.params || {};
  const initialItems = Array.isArray(params.items) ? params.items : [];
  const clearCart = params.clearCart; // optioneel callback uit ProductenScreen

  const [cartItems, setCartItems] = useState(
    initialItems.map((item) => ({
      ...item,
      qty: Math.max(1, item.qty || 1),
    }))
  );
  const [sending, setSending] = useState(false);

  const hasItems = cartItems.length > 0;

  const updateQty = (key, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.key === key) {
          const current = Math.max(1, item.qty || 1);
          return { ...item, qty: Math.max(1, current + delta) };
        }
        return item;
      })
    );
  };

  const removeItem = (key) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key));
  };

  const handleSendCartQuote = async () => {
    if (!hasItems) {
      Alert.alert(
        "Winkelmandje is leeg",
        "Voeg eerst één of meer producten toe."
      );
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert(
        "Inloggen vereist",
        "Log eerst in om een offerte aan te vragen."
      );
      return;
    }

    setSending(true);

    const requester = {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || user.email?.split("@")[0] || "",
    };

    try {
      const itemsForMailAndDb = cartItems.map((item) => ({
        artikelcode: item.artikelcode,
        productnaam: item.productnaam,
        categorie: item.categorie,
        specs: item.specs || "",
        doelgroep: item.doelgroep || "",
        qty: Math.max(1, item.qty || 1),
      }));

      // 1) ÉÉN mail met alle producten
      const emailResult = await sendProductQuoteEmail({
        type: "multi",
        items: itemsForMailAndDb,
        requester,
      });

      if (!emailResult.success) {
        console.warn("❌ Fout bij versturen multi-offerte e-mail:", emailResult);
      }

      // 2) ÉÉN Firestore-document met alle items
      await addDoc(collection(db, "quotes"), {
        uid: user.uid,
        type: "multi",
        items: itemsForMailAndDb,
        requesterUid: requester.uid,
        requesterEmail: requester.email,
        requesterName: requester.displayName,
        status: "open",
        createdAt: serverTimestamp(),
      });

      if (emailResult.success) {
        Alert.alert(
          "Offerte aangevraagd",
          `Je aanvraag voor ${cartItems.length} product(en) is verstuurd.`
        );
      } else {
        Alert.alert(
          "Offerte opgeslagen",
          "Je aanvraag is opgeslagen, maar de e-mail kon niet worden verstuurd."
        );
      }

      if (typeof clearCart === "function") {
        clearCart();
      }

      setCartItems([]);
      navigation.goBack();
    } catch (error) {
      console.error("❌ Fout bij verzenden offertes vanuit winkelmandje:", error);
      Alert.alert(
        "Fout",
        "Het is niet gelukt om de offerteaanvraag te versturen of op te slaan."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenBackground>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.inner}>
            {/* Titel */}
            <Text style={styles.title}>Je winkelmandje</Text>

            {!hasItems ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  Je hebt nog geen producten in je winkelmandje.
                </Text>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.backButtonText}>Terug naar producten</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Productlijst */}
                <ScrollView
                  style={styles.list}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                >
                  {cartItems.map((item) => (
                    <View key={item.key} style={styles.card}>
                      <Text style={styles.productName}>{item.productnaam}</Text>
                      <Text style={styles.metaText}>
                        Artikelcode: {item.artikelcode}
                      </Text>
                      <Text style={styles.metaText}>
                        Categorie: {item.categorie}
                      </Text>
                      {item.specs ? (
                        <Text style={styles.metaText}>
                          Specificaties: {item.specs}
                        </Text>
                      ) : null}

                      {/* Aantal + verwijderen */}
                      <View style={styles.cardFooterRow}>
                        <View style={styles.qtyRow}>
                          <Text style={styles.qtyLabel}>Aantal:</Text>
                          <View style={styles.qtyControls}>
                            <TouchableOpacity
                              style={styles.qtyBtn}
                              onPress={() => updateQty(item.key, -1)}
                              disabled={sending}
                            >
                              <Text style={styles.qtyBtnText}>−</Text>
                            </TouchableOpacity>
                            <Text style={styles.qtyValue}>{item.qty}</Text>
                            <TouchableOpacity
                              style={styles.qtyBtn}
                              onPress={() => updateQty(item.key, +1)}
                              disabled={sending}
                            >
                              <Text style={styles.qtyBtnText}>+</Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                        <TouchableOpacity
                          style={styles.removeBtn}
                          onPress={() => removeItem(item.key)}
                          disabled={sending}
                        >
                          <Text style={styles.removeBtnText}>Verwijder</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                {/* Onderbalk met totaal & CTA */}
                <View style={styles.bottomBar}>
                  <Text style={styles.summaryText}>
                    Producten in winkelmandje: {cartItems.length}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.ctaButton,
                      (!hasItems || sending) && { opacity: 0.6 },
                    ]}
                    onPress={handleSendCartQuote}
                    disabled={!hasItems || sending}
                  >
                    <Text style={styles.ctaButtonText}>
                      {sending
                        ? "Bezig met versturen..."
                        : "Vraag offerte aan voor deze producten"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.backLink}
                    onPress={() => navigation.goBack()}
                    disabled={sending}
                  >
                    <Text style={styles.backLinkText}>← Verder winkelen</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </SafeAreaView>
      </ScreenBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1f6f34",
    textAlign: "center",
    marginBottom: 16,
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#1f6f34",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  list: {
    flex: 1,
    marginTop: 8,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#ffffffee",
    borderRadius: 10,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f1f1f",
    marginBottom: 4,
  },
  metaText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 2,
  },

  cardFooterRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  qtyLabel: {
    fontSize: 14,
    color: "#1f1f1f",
    fontWeight: "600",
  },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1f6f34",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  qtyBtnText: {
    fontSize: 18,
    color: "#1f6f34",
    fontWeight: "800",
  },
  qtyValue: {
    minWidth: 26,
    textAlign: "center",
    fontWeight: "700",
    color: "#1f1f1f",
  },

  removeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d9534f",
    backgroundColor: "#fff5f5",
  },
  removeBtnText: {
    color: "#d9534f",
    fontWeight: "700",
    fontSize: 13,
  },

  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: "#e0e6ea",
    paddingTop: 12,
    gap: 8,
  },
  summaryText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  ctaButton: {
    backgroundColor: "#f7941e",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  backLink: {
    marginTop: 4,
    alignSelf: "flex-start",
  },
  backLinkText: {
    color: "#1f6f34",
    fontWeight: "600",
  },
});
