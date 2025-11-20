// screens/ProductenScreen.js
import React, { useMemo, useState } from "react";
import {
  useWindowDimensions,
  Alert,
  Platform,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { sendProductQuoteEmail } from "../support/email";
import { db, auth } from "../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import ScreenBackground from "../components/ScreenBackground";

const PRODUCTEN = [
    {
    artikelcode: "TBHV-2.5-I",
    productId: "AS-2.56HD-GL1",
    productnaam: "Losse batterij unit 2.5 kWh 3 fase",
    categorie: "Thuis Batterij 3-fase",
    doelgroep: "Installateur",
    specs: "2.5 kWh | Losse batterij unit",
  },
   {
    artikelcode: "TBHV-BMS-I",
    productId: "AS-2.56HD-GL1-Hbox",
    productnaam: "BMS voor TBHV-2.5-I",
    categorie: "Thuis Batterij 3-fase",
  },
    {
    artikelcode: "HO3-8-I",
    productId: "AH-8KTH-G1",
    productnaam: "Hybride Omvormer 8 kW 3 fase",
    categorie: "Thuis Batterij 3-fase",
    specs: "8 kW",
  },
  {
    artikelcode: "HO3-10-I",
    productId: "AH-10KTH-G1",
    productnaam: "Hybride Omvormer 10 kW 3 fase",
    categorie: "Thuis Batterij 3-fase",
    specs: "10 kW",
  },
  {
    artikelcode: "TBHV-CB-I",
    productId: "ATS1200K-I",
    productnaam: "Combinerbox voor thuisbatterij 3-fase",
    categorie: "Thuis Batterij 3-fase",
    doelgroep: "Installateur",
    specs: "",
  },
   {
    artikelcode: "TBLV-PS-I",
    productId: "Power Sensor 3-fase",
    productnaam: "Power Sensor 3-fase",
    categorie: "Thuis Batterij 3-fase",
    doelgroep: "Installateur",
    specs: "",
  },
  {
    artikelcode: "TBLV-05-I",
    productId: "AS-5.12LDL-GL1",
    productnaam: "Losse batterij unit 5 kWh 1 fase",
    categorie: "Thuis Batterij 1-fase",
    specs: "5 kWh",
  },
  {
    artikelcode: "AS-system accesoires-I",
    productId: "AS-system accesoires",
    productnaam: "AS-system accesoires",
    categorie: "Thuisbatterij 1-fase",
  },
  {
    artikelcode: "HO1-4.6-I",
    productId: "AH-4.6KSL-G2",
    productnaam: "Hybride Omvormer 4.6 kW 1 fase",
    categorie: "Thuisbatterij 1-fase",
    specs: "4.6 kW",
  },

  {
    artikelcode: "HO1-6-I",
    productId: "AH-6KSL-G2",
    productnaam: "Hybride omvormer 6 kW 1 fase",
    categorie: "Thuisbatterij 1-fase",
    specs: "6 kW",
  },

    {
    artikelcode: "ES64/30K-A/EU",
    productId: "ES64/30K-A/EU",
    productnaam: "Smart PV ESS Cabinet 64 kWh",
    categorie: "Zakelijke baterij",
    doelgroep: "Installateur",
    specs: "64 kWh",
  },
  {
    artikelcode: "ES96/48K-A/EU",
    productId: "ES96/48K-A/EU",
    productnaam: "Smart PV ESS Cabinet 96 kWh",
    categorie: "Zakelijke baterij",
    specs: "96 kWh",
  },
  {
    artikelcode: "ES261/125K-A/EU",
    productId: "ES261/125K-A/EU",
    productnaam: "ESS All-in-one 261 kWh",
    categorie: "Zakelijke baterij",
    doelgroep: "Installateur",
    specs: "261 kWh",
  },

  {
    artikelcode: "ES2090/1200K-A/EU",
    productId: "ES2090/1200K-A/EU",
    productnaam: "ESS All-in-one 2.090 MWh",
    categorie: "Zakelijke baterij",
    specs: "2090 kWh",
  },
  {
    artikelcode: "ES5009/2580K-C/EU",
    productId: "ES5009/2580K-C/EU",
    productnaam: "ESS All-in-one 5.015 MWh",
    categorie: "Zakelijke baterij",
    specs: "5015 kWh",
  },

  {
    artikelcode: "TBLV-PS-I",
    productId: "Power Sensor 1-fase",
    productnaam: "Power Sensor 1-fase",
    categorie: "Thuis Batterij 1-fase",
    doelgroep: "Installateur",
    specs: "",
  },
];

// ⭐ Extra producten die óók op de Thuisbatterij-pagina moeten komen
const THUISBATTERIJ_RELATED_IDS = new Set([
  "AS-system accesoires",
  "AH-4.6KSL-G2",
  "AH-6KSL-G2",
  "AS-2.56HD-GL1-Hbox",
  "AH-8KTH-G1",
  "AH-10KTH-G1",
]);

function ProductenScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const [sendingId, setSendingId] = useState(null);
  const insets = useSafeAreaInsets();  
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("zakelijk");

  const [selected, setSelected] = useState(new Map());
  const [quantities, setQuantities] = useState({});

  const getUniqueKey = (p) => `${p.artikelcode}__${p.productId}`;

  // ⭐ FILTER + TABLOGICA
  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();

    return PRODUCTEN.filter((p) => {
      const isThuisCategorie =
        p.categorie?.toLowerCase().includes("thuis batterij") ?? false;

      const isThuisExtra = THUISBATTERIJ_RELATED_IDS.has(p.productId);

      const isThuis = isThuisCategorie || isThuisExtra;

      if (activeTab === "thuis" && !isThuis) return false;
      if (activeTab === "zakelijk" && isThuis) return false;

      if (!q) return true;

      const hay = [
        p.productnaam,
        p.artikelcode,
        p.categorie,
        p.specs,
        p.productId,
     
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [query, activeTab]);

  // qty helpers
  const incQty = (key) =>
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(1, (prev[key] || 1) + 1),
    }));

  const decQty = (key) =>
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(1, (prev[key] || 1) - 1),
    }));

  const toggleSelect = (product) => {
    const key = getUniqueKey(product);

    setSelected((prev) => {
      const next = new Map(prev);

      if (next.has(key)) {
        next.delete(key);
        setQuantities((q) => {
          const { [key]: _, ...rest } = q;
          return rest;
        });
      } else {
        next.set(key, product);
        setQuantities((q) => ({ ...q, [key]: q[key] || 1 }));
      }

      return next;
    });
  };

  const clearSelection = () => {
    setSelected(new Map());
    setQuantities({});
  };

  const handleQuoteRequest = async (product) => {
    if (sendingId) return;

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Inloggen vereist", "Log eerst in om een offerte aan te vragen.");
      return;
    }

    const requester = {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
    };

    const uniqueKey = getUniqueKey(product);
    const qty = Math.max(1, quantities[uniqueKey] || 1);

    setSendingId(product.artikelcode);

    try {
      const result = await sendProductQuoteEmail({
        type: "single",
        product: { ...product, qty },
        requester,
      });

      await addDoc(collection(db, "quotes"), {
        uid: user.uid,
        type: "single",
        artikelcode: product.artikelcode,
        productnaam: product.productnaam,
        categorie: product.categorie,
        specs: product.specs || "",
        qty,
        requesterUid: requester.uid,
        requesterEmail: requester.email,
        requesterName: requester.displayName,
        status: "open",
        createdAt: serverTimestamp(),
      });

      Alert.alert(
        "Offerte aangevraagd",
        `Je aanvraag voor ${qty}× ${product.productnaam} is verstuurd.`
      );
    } catch (err) {
      console.error("❌ Offerte-aanvraag fout:", err);
      Alert.alert("Fout", "De offerte kon niet worden opgeslagen of verzonden.");
    } finally {
      setSendingId(null);
    }
  };
  // batch aanvraag (multi)
  const handleBatchQuoteRequest = async () => {
    if (selected.size === 0) {
      Alert.alert("Geen selectie", "Vink eerst één of meer producten aan.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert(
        "Inloggen vereist",
        "Je moet ingelogd zijn om een offerte aan te vragen."
      );
      return;
    }

    const requester = {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || user.email?.split("@")[0] || "",
    };

    const items = Array.from(selected.entries()).map(([key, p]) => ({
      artikelcode: p.artikelcode,
      productnaam: p.productnaam,
      categorie: p.categorie,
      specs: p.specs || "",
      qty: Math.max(1, quantities[key] || 1),
    }));

    try {
      await addDoc(collection(db, "quotes"), {
        uid: user.uid,
        type: "multi",
        items,
        requesterUid: requester.uid,
        requesterEmail: requester.email,
        requesterName: requester.displayName,
        status: "open",
        createdAt: serverTimestamp(),
      });

      let mailFailures = 0;
      for (const item of items) {
        try {
          await sendProductQuoteEmail({
            type: "single",
            product: item,
            requester,
          });
        } catch (e) {
          mailFailures += 1;
          console.warn("Mailfail voor item", item?.productnaam, e);
        }
      }

      if (mailFailures === 0) {
        Alert.alert(
          "Offerte aangevraagd",
          `Aanvraag voor ${items.length} producttypen is verstuurd.`
        );
      } else if (mailFailures < items.length) {
        Alert.alert(
          "Gedeeltelijke mailfout",
          `Aanvraag opgeslagen. ${mailFailures} e-mails zijn niet verstuurd.`
        );
      } else {
        Alert.alert(
          "Offerte opgeslagen",
          "Aanvraag opgeslagen, maar e-mails konden niet worden verstuurd."
        );
      }

      clearSelection();
      navigation.navigate("Offertes");
    } catch (error) {
      console.error("❌ Batch-offerte fout:", error);
      Alert.alert(
        "Fout",
        "Het is niet gelukt om de batch-aanvraag op te slaan."
      );
    }
  };

  const getCardWidth = () => {
    if (width > 1024) return "48%";
    if (width > 768) return "70%";
    return "100%";
  };

  const selectedCount = selected.size;

  const titleText =
    activeTab === "zakelijk"
      ? "Zakelijke producten voor installateurs"
      : "Thuisbatterijen voor installateurs";

  return (
    <View style={styles.container}>
      <ScreenBackground>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={[
                styles.scrollContent,
                { paddingHorizontal: width > 768 ? 48 : 24 },
              ]}
              showsVerticalScrollIndicator={false}
            >
              {/* Titel */}
              <Text style={[styles.title, { fontSize: width > 768 ? 32 : 24 }]}>
                {titleText}
              </Text>

              {/* Tab-menu */}
              <View style={styles.tabRow}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === "zakelijk" && styles.tabButtonActive,
                  ]}
                  onPress={() => setActiveTab("zakelijk")}
                >
                  <Text
                    style={[
                      styles.tabButtonText,
                      activeTab === "zakelijk" && styles.tabButtonTextActive,
                    ]}
                  >
                    Zakelijke producten
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === "thuis" && styles.tabButtonActive,
                  ]}
                  onPress={() => setActiveTab("thuis")}
                >
                  <Text
                    style={[
                      styles.tabButtonText,
                      activeTab === "thuis" && styles.tabButtonTextActive,
                    ]}
                  >
                    Thuisbatterijen
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Zoeken */}
              <View style={styles.searchRow}>
                <TextInput
                  style={styles.searchInput}
                  value={query}
                  placeholder="Zoek op naam, artikelcode, categorie, specs…"
                  onChangeText={setQuery}
                  placeholderTextColor="#666"
                  returnKeyType="search"
                />
                {!!query && (
                  <TouchableOpacity
                    style={styles.clearBtn}
                    onPress={() => setQuery("")}
                  >
                    <Text style={styles.clearBtnText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Batch-actieknoppen */}
              <View style={styles.batchBar}>
                <Text style={styles.batchInfo}>
                  Geselecteerd: {selectedCount}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.batchBtn,
                    selectedCount === 0 && { opacity: 0.5 },
                  ]}
                  onPress={handleBatchQuoteRequest}
                  disabled={selectedCount === 0}
                >
                  <Text style={styles.batchBtnText}>
                    Vraag {selectedCount > 0 ? `${selectedCount} ` : ""}offertes
                    aan
                  </Text>
                </TouchableOpacity>
                {selectedCount > 0 && (
                  <TouchableOpacity
                    style={styles.batchClearBtn}
                    onPress={clearSelection}
                  >
                    <Text style={styles.batchClearBtnText}>Reset selectie</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Product cards */}
              <View
                style={[
                  styles.productsWrapper,
                  { flexDirection: width > 1024 ? "row" : "column" },
                ]}
              >
                {filteredProducts.map((product) => {
                  const uniqueKey = getUniqueKey(product);
                  const isSending = sendingId === product.artikelcode;
                  const isSelected = selected.has(uniqueKey);
                  const qty = Math.max(1, quantities[uniqueKey] || 1);

                  return (
                    <View
                      key={uniqueKey}
                      style={[styles.productCard, { width: getCardWidth() }]}
                    >
                      <View style={styles.cardHeaderRow}>
                        {/* checkbox */}
                        <TouchableOpacity
                          style={[
                            styles.checkbox,
                            isSelected && styles.checkboxChecked,
                          ]}
                          onPress={() => toggleSelect(product)}
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked: isSelected }}
                        >
                          {isSelected ? (
                            <Text style={styles.checkboxTick}>✓</Text>
                          ) : null}
                        </TouchableOpacity>

                        <Text style={styles.productName}>
                          {product.productnaam}
                        </Text>
                      </View>

                      <Text style={styles.productMeta}>
                        Artikelcode: {product.artikelcode}
                      </Text>
                      <Text style={styles.productMeta}>
                        Categorie: {product.categorie}
                      </Text>
                      {product.specs ? (
                        <Text style={styles.productMeta}>
                          Specificaties: {product.specs}
                        </Text>
                      ) : null}

                      {/* Aantal-selector bij selectie */}
                      {isSelected && (
                        <View style={styles.qtyRow}>
                          <Text style={styles.qtyLabel}>Aantal:</Text>
                          <View style={styles.qtyControls}>
                            <TouchableOpacity
                              style={styles.qtyBtn}
                              onPress={() => decQty(uniqueKey)}
                              accessibilityLabel="Verlaag aantal"
                            >
                              <Text style={styles.qtyBtnText}>−</Text>
                            </TouchableOpacity>
                            <Text style={styles.qtyValue}>{qty}</Text>
                            <TouchableOpacity
                              style={styles.qtyBtn}
                              onPress={() => incQty(uniqueKey)}
                              accessibilityLabel="Verhoog aantal"
                            >
                              <Text style={styles.qtyBtnText}>+</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}

                      <View style={styles.cardActions}>
                        <TouchableOpacity
                          style={[
                            styles.quoteButton,
                            isSending && styles.quoteButtonDisabled,
                          ]}
                          onPress={() => handleQuoteRequest(product)}
                          disabled={isSending}
                        >
                          <Text style={styles.quoteButtonText}>
                            {isSending ? "Bezig..." : "Vraag offerte aan"}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.selectToggleBtn,
                            isSelected && styles.selectToggleBtnActive,
                          ]}
                          onPress={() => toggleSelect(product)}
                        >
                          <Text
                            style={[
                              styles.selectToggleText,
                              isSelected && styles.selectToggleTextActive,
                            ]}
                          >
                            {isSelected
                              ? "Verwijder uit selectie"
                              : "Selecteer"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Mijn offerte-aanvragen ONDERAAN */}
              <TouchableOpacity
                style={[styles.overviewButton, { marginTop: 24 }]}
                onPress={() => navigation.navigate("Offertes")}
              >
                <Text style={styles.overviewButtonText}>
                  Mijn offerte-aanvragen →
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ScreenBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: "relative" },
  safeArea: { flex: 1, },
  backgroundImage: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignSelf: "center",
    width: "100%",
    maxWidth: 1200,
    paddingTop: 32,
    paddingBottom: 48,
    gap: 24,
  },
  title: { fontWeight: "700", color: "#1f6f34", textAlign: "center" },

  // tabs
  tabRow: {
    width: "100%",
    maxWidth: 960,
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1f6f34",
    backgroundColor: "#ffffffee",
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#1f6f34",
  },
  tabButtonText: {
    fontWeight: "600",
    color: "#1f6f34",
  },
  tabButtonTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },

  // search
  searchRow: {
    width: "100%",
    maxWidth: 960,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#ffffffee",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e0e6ea",
    color: "#111",
  },
  clearBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffffee",
    borderWidth: 1,
    borderColor: "#e0e6ea",
  },
  clearBtnText: { fontSize: 18, color: "#444" },

  // Offertes overzicht knop (nu onderaan)
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

  // Batch balk
  batchBar: {
    width: "100%",
    maxWidth: 960,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
  },
  batchInfo: { color: "#333", fontWeight: "600" },
  batchBtn: {
    backgroundColor: "#1f6f34",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  batchBtnText: { color: "#fff", fontWeight: "700" },
  batchClearBtn: {
    backgroundColor: "#ffffffee",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#e0e6ea",
  },
  batchClearBtnText: { color: "#1f1f1f", fontWeight: "600" },

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
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#1f6f34",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkboxChecked: { backgroundColor: "#1f6f34" },
  checkboxTick: { color: "#fff", fontWeight: "800" },
  productName: { fontSize: 20, fontWeight: "700", color: "#1f1f1f" },
  productMeta: { fontSize: 16, color: "#333", marginBottom: 4 },

  // qty styles
  qtyRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyLabel: {
    color: "#1f1f1f",
    fontWeight: "600",
  },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#1f6f34",
  },
  qtyBtnText: {
    fontSize: 18,
    color: "#1f6f34",
    fontWeight: "800",
  },
  qtyValue: {
    minWidth: 28,
    textAlign: "center",
    fontWeight: "700",
    color: "#1f1f1f",
  },

  cardActions: {
    marginTop: 12,
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  quoteButton: {
    backgroundColor: "#f7941e",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  quoteButtonDisabled: { opacity: 0.5 },
  quoteButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  selectToggleBtn: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#1f6f34",
  },
  selectToggleBtnActive: { backgroundColor: "#eaf6ec" },
  selectToggleText: { color: "#1f6f34", fontWeight: "700" },
  selectToggleTextActive: { color: "#1f6f34", fontWeight: "800" },
});

export default ProductenScreen;
