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
  SafeAreaView,
  Platform,
} from "react-native";

import { getAuth } from "firebase/auth";
import ScreenBackground from "../components/ScreenBackground";

const auth = getAuth();

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isWide = width > 768; // iPad / web / brede layout

  return (
    <View style={styles.root}>
      {/* Volledige achtergrond laag */}
      <ScreenBackground
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageInner}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Logout / terug-naar-login knop */}
          <TouchableOpacity
            onPress={() => navigation.replace("LoginScreen")}
            style={styles.backTopLeft}
            accessibilityRole="button"
            accessibilityLabel="Terug naar log-in"
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
              {/* Logo */}
              <Image
                source={require("../assets/logo.png")}
                style={[
                  styles.logo,
                  {
                    width: isWide ? 300 : 200,
                    height: isWide ? 120 : 80,
                  },
                ]}
              />

              {/* Titel */}
              <Text style={[styles.title, { fontSize: isWide ? 36 : 24 }]}>
                WattsNext Advies
              </Text>

              {/* Tiles */}
              <View
                style={[
                  styles.tileGrid,
                  // op smalle schermen willen we 1 kolom (100%), op brede 2 kolommen
                  { columnGap: isWide ? 16 : 0 },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.tileButton,
                    {
                      flexBasis: isWide ? "48%" : "100%",
                      minHeight: isWide ? 200 : 200,
                    },
                  ]}
                  onPress={() => navigation.navigate("Stap 1")}
                  accessibilityRole="button"
                  accessibilityLabel="Start Advies"
                >
                  <Text style={styles.tileButtonText}>Start Advies</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tileButton,
                    {
                      flexBasis: isWide ? "48%" : "100%",
                      minHeight: isWide ? 200 : 200,
                    },
                  ]}
                  onPress={() => navigation.navigate("AccountBeheren")}
                  accessibilityRole="button"
                  accessibilityLabel="Account beheren"
                >
                  <Text style={styles.tileButtonText}>Account beheren</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tileButton,
                    {
                      flexBasis: isWide ? "48%" : "100%",
                      minHeight: isWide ? 200 : 200,
                    },
                  ]}
                  onPress={() => navigation.navigate("SavedAdvices")}
                  accessibilityRole="button"
                  accessibilityLabel="Bekijk opgeslagen adviezen"
                >
                  <Text style={styles.tileButtonText}>Opgeslagen adviezen</Text>
                </TouchableOpacity>

                {/* Nieuwe tegel voor de productcatalogus */}
                <TouchableOpacity
                  style={[
                    styles.tileButton,
                    {
                      flexBasis: isWide ? "48%" : "100%",
                      minHeight: isWide ? 200 : 200,
                    },
                  ]}
                  onPress={() => navigation.navigate("ProductenScreen")}
                  accessibilityRole="button"
                  accessibilityLabel="Bekijk producten en vraag offerte aan"
                >
                  <Text style={styles.tileButtonText}>Producten</Text>
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
  root: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },

  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  // dit bepaalt hoe de afbeelding zich in de container gedraagt
  backgroundImageInner: {
    resizeMode: Platform.OS === "web" ? "contain" : "cover",
  },

  safeArea: {
    flex: 1,
    position: "relative",
  },

  // terugknop linksboven
  backTopLeft: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#ffffffcc",
    borderRadius: 10,
    zIndex: 10,
  },
  backText: {
    color: "#1a73e8",
    fontSize: 16,
    fontWeight: "500",
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: "center",
    gap: 32,
  },

  content: {
    width: "100%",
    alignItems: "center",
    gap: 32,
    paddingTop: 32,
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
    backgroundColor: "#f7941e", // oranje
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,

    justifyContent: "center",
    alignItems: "center",

    // schaduw voor dikke card look
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
