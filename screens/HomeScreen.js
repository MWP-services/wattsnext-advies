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

const auth = getAuth();

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      {/* Achtergrondafbeelding zoals in Step2Screen */}
      <Image
        source={require("../assets/achtergrond.png")}
        style={styles.backgroundImage}
      />

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
            { paddingHorizontal: width > 768 ? 48 : 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Logo */}
            <Image
              source={require("../assets/logo.png")}
              style={[
                styles.logo,
                {
                  width: width > 768 ? 300 : 200,
                  height: width > 768 ? 120 : 80,
                },
              ]}
              resizeMode="contain"
            />

            {/* Titel */}
            <Text style={[styles.title, { fontSize: width > 768 ? 36 : 24 }]}>
              WattsNext Advies
            </Text>

            {/* 2 x 2 tegel-grid */}
            <View style={styles.tileGrid}>
              <TouchableOpacity
                style={styles.tileButton}
                onPress={() => navigation.navigate("Stap 1")}
                accessibilityRole="button"
                accessibilityLabel="Start Advies"
              >
                <Text style={styles.tileButtonText}>Start Advies</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tileButton}
                onPress={() => navigation.navigate("AccountBeheren")}
                accessibilityRole="button"
                accessibilityLabel="Account beheren"
              >
                <Text style={styles.tileButtonText}>Account beheren</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tileButton}
                onPress={() => navigation.navigate("SavedAdvices")}
                accessibilityRole="button"
                accessibilityLabel="Bekijk opgeslagen adviezen"
              >
                <Text style={styles.tileButtonText}>Opgeslagen adviezen</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tileButton}
                onPress={() => navigation.navigate("Agenda")}
                accessibilityRole="button"
                accessibilityLabel="Ga naar agenda"
              >
                <Text style={styles.tileButtonText}>Agenda</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  // layout / background
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#f0f4f8",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    resizeMode: Platform.OS === "web" ? "contain" : "cover",
    zIndex: -1,
  },

  safeArea: {
    flex: 1,
  },

  // scroll wrapper
  scrollContent: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: "center",
    gap: 32,
  },

  // centrale content
  content: {
    width: "100%",
    maxWidth: 600,
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

  // GRID met enorme tegels
  tileGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 16,
    rowGap: 16,
  },

  tileButton: {
    backgroundColor: "#f7941e", // oranje
    borderRadius: 10,

    // NOG groter
    minHeight: 220,
    flexBasis: "48%", // iets ruimer dan 47% zodat hij visueel nog voller lijkt
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
});

