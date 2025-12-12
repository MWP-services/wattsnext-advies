// screens/HomeScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { getAuth } from "firebase/auth";
import ScreenBackground from "../components/ScreenBackground";

const auth = getAuth();

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isWide = width > 768; // iPad / web / brede layout
  const insets = useSafeAreaInsets(); // <<< FIX voor notch / statusbalk spacing

  return (
    <View style={styles.container}>
      <ScreenBackground>
        <SafeAreaView style={styles.safeArea}>
          {/* TERUGKNOP — verplaatst onder de notch */}
          <TouchableOpacity
            onPress={() => navigation.replace("LoginScreen")}
            style={[
              styles.backTopLeft,
              { top: insets.top + 8 }, // <<< CRUCIAAL: altijd klikbaar op iPhone
            ]}
          >
            <Text style={styles.backText}>← Terug naar log-in</Text>
          </TouchableOpacity>

          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingHorizontal: isWide ? 48 : 24 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.content, { maxWidth: isWide ? 600 : 480 }]}>
              {/* LOGO */}
              <Image
                source={require("../assets/logo.png")}
                style={[
                  styles.logo,
                  {
                    width: isWide ? 300 : 200,
                    height: isWide ? 120 : 80,
                  },
                ]}
                resizeMode="contain"
              />

              {/* TITEL */}
              <Text style={[styles.title, { fontSize: isWide ? 36 : 24 }]}>
                WattsNext Advies
              </Text>

              {/* Tegel lay-out */}
              <View
                style={[
                  styles.tileGrid,
                  { columnGap: isWide ? 16 : 0 },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.tileButton,
                    {
                      flexBasis: isWide ? "48%" : "100%",
                      minHeight: 200,
                    },
                  ]}
                  onPress={() => navigation.navigate("Stap 1")}
                >
                  <Text style={styles.tileButtonText}>Start Advies</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tileButton,
                    {
                      flexBasis: isWide ? "48%" : "100%",
                      minHeight: 200,
                    },
                  ]}
                  onPress={() => navigation.navigate("AccountBeheren")}
                >
                  <Text style={styles.tileButtonText}>Account beheren</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tileButton,
                    {
                      flexBasis: isWide ? "48%" : "100%",
                      minHeight: 200,
                    },
                  ]}
                  onPress={() => navigation.navigate("SavedAdvices")}
                >
                  <Text style={styles.tileButtonText}>Opgeslagen adviezen</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tileButton,
                    {
                      flexBasis: isWide ? "48%" : "100%",
                      minHeight: 200,
                    },
                  ]}
                  onPress={() => navigation.navigate("ProductenScreen")}
                >
                  <Text style={styles.tileButtonText}>Bestellen</Text>
                </TouchableOpacity>

                {/* ✅ NIEUWE TEKSTTEGEL: Mijn offerte-aanvragen */}
                <TouchableOpacity
                  style={[
                    styles.tileButton,
                    {
                      flexBasis: isWide ? "48%" : "100%",
                      minHeight: 200,
                    },
                  ]}
                  onPress={() => navigation.navigate("Offertes")}
                >
                  <Text style={styles.tileButtonText}>
                    Mijn offerte-aanvragen
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
    backgroundColor: "#f0f4f8",
  },

  safeArea: {
    flex: 1,
    position: "relative",
  },

  backTopLeft: {
    position: "absolute",
    top: 0, // wordt overschreven door insets.top + 8
    left: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#ffffffcc",
    borderRadius: 10,
    zIndex: 20,
  },

  backText: {
    color: "#1a73e8",
    fontSize: 16,
    fontWeight: "500",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
    paddingBottom: 60,
    gap: 32,
    alignSelf: "center",
    width: "100%",
    maxWidth: 1200,
    paddingTop: 40,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
    width: "100%",
    gap: 32,
  },

  logo: {
    marginBottom: 10,
  },

  title: {
    fontWeight: "700",
    color: "#1f6f34",
    textAlign: "center",
  },

  tileGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    rowGap: 16,
  },

  tileButton: {
    backgroundColor: "#f7941e",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 10,
  },

  tileButtonText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 22,
    lineHeight: 26,
  },
});
