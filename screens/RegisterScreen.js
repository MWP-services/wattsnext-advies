import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";
import { auth, db } from "../firebaseConfig";
import ScreenBackground from "../components/ScreenBackground";

export default function RegisterScreen({ navigation }) {
  const [naam, setNaam] = useState("");
  const [bedrijf, setBedrijf] = useState("");
  const [adres, setAdres] = useState("");
  const [functietitel, setFunctietitel] = useState("");
  const [email, setEmail] = useState("");
  const [telefoonnummer, setTelefoonnummer] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();

  const handleRegister = async () => {
    if (!email || !password || !naam) {
      Toast.show({
        type: "error",
        text1: "Controleer velden",
        text2: "Naam, e-mail en wachtwoord zijn verplicht.",
      });
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: naam.trim() });

      const profileRef = doc(db, "users", user.uid);
      const phoneTrimmed = telefoonnummer.trim();

      await setDoc(profileRef, {
        naam: naam.trim(),
        bedrijf: bedrijf.trim(),
        adres: adres.trim(),
        functietitel: functietitel.trim(),
        telefoonnummer: phoneTrimmed,
        aangemaaktOp: new Date(),
      }).catch((e) =>
        console.log("Profiel write (background) fout:", e?.message),
      );

      setLoading(false);

      Toast.show({
        type: "success",
        text1: "Account aangemaakt",
        text2: "Je kunt nu inloggen.",
      });
      setTimeout(() => navigation.replace("LoginScreen"), 900);
    } catch (error) {
      setLoading(false);
      if (error?.code === "auth/email-already-in-use") {
        Toast.show({
          type: "info",
          text1: "E-mail in gebruik",
          text2: "Log in met dit adres.",
        });
        setTimeout(
          () =>
            navigation.replace("LoginScreen", { prefillEmail: email.trim() }),
          900,
        );
      } else {
        Toast.show({
          type: "error",
          text1: "Fout bij registreren",
          text2: error?.message ?? "Probeer het opnieuw.",
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScreenBackground>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.select({
              ios: 24,
              android: 0,
              default: 0,
            })}
          >
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
              >
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
                <Text
                  style={[styles.title, { fontSize: width > 768 ? 32 : 24 }]}
                >
                  Account aanmaken
                </Text>

                <TextInput
                  placeholder="Naam"
                  value={naam}
                  onChangeText={setNaam}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Bedrijf"
                  value={bedrijf}
                  onChangeText={setBedrijf}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Adres"
                  value={adres}
                  onChangeText={setAdres}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Functietitel"
                  value={functietitel}
                  onChangeText={setFunctietitel}
                  style={styles.input}
                />
                <TextInput
                  placeholder="E-mail"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
                <TextInput
                  placeholder="Telefoonnummer"
                  value={telefoonnummer}
                  onChangeText={setTelefoonnummer}
                  keyboardType="phone-pad"
                  style={styles.input}
                />
                <TextInput
                  placeholder="Wachtwoord"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.input}
                  onSubmitEditing={handleRegister}
                />

                <TouchableOpacity
                  style={[
                    styles.button,
                    { width: width > 768 ? 300 : "80%" },
                    loading && { opacity: 0.7 },
                  ]}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Bezig..." : "Registreer"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.link}
                  onPress={() => navigation.replace("LoginScreen")}
                >
                  <Text style={styles.linkText}>Al een account? Log in</Text>
                </TouchableOpacity>
              </ScrollView>
            </TouchableWithoutFeedback>
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
  content: {
    padding: 24,
    alignItems: "center",
    gap: 16,
    paddingBottom: 40,
  },
  logo: {
    marginBottom: 12,
  },
  title: {
    fontWeight: "bold",
    color: "#3eaf4f",
    textAlign: "center",
  },
  input: {
    width: "80%",
    padding: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#f7941e",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    marginTop: 20,
  },
  linkText: {
    color: "#1a73e8",
    textDecorationLine: "underline",
  },
});
