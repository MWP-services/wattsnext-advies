import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Alert,
} from "react-native";
import { auth } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import ScreenBackground from "../components/ScreenBackground";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const { width } = useWindowDimensions();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, wachtwoord);
      navigation.replace("HomeScreen");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGuest = () => {
    navigation.replace("Particulier");
  };

  // ⭐ Wachtwoord vergeten → reset email sturen
  const handlePasswordReset = async () => {
    console.log("🔑 Reset-knop geklikt met email:", email);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert(
        "E-mailadres nodig",
        "Vul eerst je e-mailadres in bij het veld 'E-mailadres' bovenaan."
      );
      return;
    }

    if (resetLoading) return; // dubbelklikken negeren
    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      Alert.alert(
        "E-mail verstuurd",
        "Je ontvangt een mail met een link om je wachtwoord te resetten."
      );
    } catch (err) {
      console.log("❌ Reset error:", err.code, err.message);

      let message = "Er ging iets mis. Controleer je e-mailadres.";

      if (err.code === "auth/quota-exceeded") {
        message =
          "Er zijn tijdelijk te veel resetverzoeken verstuurd vanaf dit project. Probeer het later opnieuw.";
      } else if (err.code === "auth/user-not-found") {
        message = "Er bestaat geen account met dit e-mailadres.";
      } else if (err.code === "auth/invalid-email") {
        message = "Dit is geen geldig e-mailadres.";
      } else if (err.code === "auth/operation-not-allowed") {
        message =
          "E-mail/wachtwoord inloggen is nog niet ingeschakeld in Firebase.";
      } else if (err.code === "auth/too-many-requests") {
        message =
          "Te veel pogingen. Wacht even en probeer het later nog een keer.";
      } else if (err.code === "auth/network-request-failed") {
        message =
          "Geen verbinding met de server. Controleer je internetverbinding.";
      }

      Alert.alert("Fout", `${message}\n\n(${err.code})`);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenBackground>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoider}
          >
            <View style={styles.content}>
              <Image
                source={require("../assets/logo.png")}
                style={{
                  width: width > 768 ? 300 : 200,
                  height: width > 768 ? 120 : 80,
                  marginBottom: 40,
                }}
                resizeMode="contain"
              />

              <Text style={[styles.title, { fontSize: width > 768 ? 32 : 24 }]}>
                Inloggen
              </Text>

              <TextInput
                placeholder="E-mailadres"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TextInput
                placeholder="Wachtwoord"
                placeholderTextColor="#aaa"
                value={wachtwoord}
                onChangeText={setWachtwoord}
                style={styles.input}
                secureTextEntry
              />

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log in</Text>
              </TouchableOpacity>

              {/* ⭐ Wachtwoord vergeten knop met loading state */}
              <TouchableOpacity
                onPress={handlePasswordReset}
                style={[styles.forgotButton, resetLoading && { opacity: 0.6 }]}
                disabled={resetLoading}
              >
                <Text style={styles.forgotText}>
                  {resetLoading ? "Bezig..." : "Wachtwoord vergeten?"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("RegisterScreen")}
                style={styles.link}
              >
                <Text style={styles.linkText}>
                  Nog geen account? Registreer hier
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.guestButton} onPress={handleGuest}>
                <Text style={styles.guestButtonText}>Doorgaan als gast</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
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
  safeArea: {
    flex: 1,
  },
  keyboardAvoider: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignSelf: "center",
    width: "100%",
    maxWidth: 1200,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 20,
    color: "#3eaf4f",
    textAlign: "center",
  },
  input: {
    width: "80%",
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#f7941e",
    padding: 16,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  forgotButton: {
    marginTop: 12,
  },
  forgotText: {
    color: "#1a73e8",
    textDecorationLine: "underline",
    fontSize: 15,
    fontWeight: "500",
  },
  guestButton: {
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    width: "80%",
    backgroundColor: "#888",
    alignItems: "center",
  },
  guestButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  link: {
    marginTop: 20,
  },
  linkText: {
    color: "#1a73e8",
    textDecorationLine: "underline",
  },
});
