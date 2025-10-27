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
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Image source={require("../assets/achtergrond.png")} style={styles.backgroundImage} />

      <SafeAreaView style={styles.safeArea}>
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

            <Text style={[styles.title, { fontSize: width > 768 ? 36 : 24 }]}>WattsNext Advies</Text>

            <View style={styles.buttonGrid}>
              <TouchableOpacity
                style={[styles.gridButton, styles.button]}
                onPress={() => navigation.navigate("Stap 1")}
                accessibilityRole="button"
                accessibilityLabel="Start Advies"
              >
                <Text style={[styles.buttonText, { fontSize: width > 768 ? 20 : 18 }]}>Start Advies</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.gridButton, styles.secondaryButton]}
                onPress={() => navigation.navigate("AccountBeheren")}
                accessibilityRole="button"
                accessibilityLabel="Account beheren"
              >
                <Text
                  style={[styles.secondaryButtonText, { fontSize: width > 768 ? 18 : 16 }]}
                >
                  Account beheren
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.gridButton, styles.secondaryButton]}
                onPress={() => navigation.navigate("SavedAdvices")}
                accessibilityRole="button"
                accessibilityLabel="Bekijk opgeslagen adviezen"
              >
                <Text
                  style={[styles.secondaryButtonText, { fontSize: width > 768 ? 18 : 16 }]}
                >
                  Opgeslagen adviezen
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.gridButton, styles.secondaryButton]}
                onPress={() => navigation.navigate("Agenda")}
                accessibilityRole="button"
                accessibilityLabel="Ga naar agenda"
              >
                <Text
                  style={[styles.secondaryButtonText, { fontSize: width > 768 ? 18 : 16 }]}
                >
                  Agenda
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: "cover",
  },
  safeArea: {
    flex: 1,
  },
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
    maxWidth: 900,
    alignItems: "center",
    gap: 32,
  },
  logo: {
    marginBottom: 12,
  },
  title: {
    fontWeight: "700",
    color: "#1f6f34",
    textAlign: "center",
  },
  buttonGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
  },
  gridButton: {
    flexBasis: "45%",
    minWidth: 160,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#1f6f34",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#ffffffdd",
    borderWidth: 1,
    borderColor: "#1f6f34",
  },
  secondaryButtonText: {
    color: "#1f6f34",
    fontWeight: "600",
    textAlign: "center",
  },
});
