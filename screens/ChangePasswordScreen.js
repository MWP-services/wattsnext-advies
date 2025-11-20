// screens/ChangePasswordScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenBackground from "../components/ScreenBackground";

import { auth } from "../firebaseConfig";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Onvolledig", "Vul alle velden in.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Let op", "De nieuwe wachtwoorden komen niet overeen.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        "Te kort",
        "Het nieuwe wachtwoord moet minimaal 6 tekens lang zijn."
      );
      return;
    }

    const user = auth.currentUser;
    if (!user || !user.email) {
      Alert.alert(
        "Niet ingelogd",
        "Je moet ingelogd zijn met e-mail en wachtwoord om dit te doen."
      );
      return;
    }

    setLoading(true);

    try {
      // 1) opnieuw inloggen (reauthenticate) met huidig wachtwoord
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // 2) wachtwoord updaten
      await updatePassword(user, newPassword);

      Alert.alert(
        "Gelukt",
        "Je wachtwoord is succesvol gewijzigd.",
        [{ text: "OK", onPress: () => navigation.goBack() }],
        { cancelable: false }
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log("❌ Wachtwoord wijzigen fout:", error);
      let msg = "Er ging iets mis bij het wijzigen van je wachtwoord.";

      if (error.code === "auth/wrong-password") {
        msg = "Het huidige wachtwoord is onjuist.";
      } else if (error.code === "auth/weak-password") {
        msg = "Het nieuwe wachtwoord is te zwak.";
      } else if (error.code === "auth/too-many-requests") {
        msg =
          "Te veel mislukte pogingen. Probeer het later opnieuw of reset je wachtwoord via e-mail.";
      }

      Alert.alert("Fout", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenBackground>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <View style={styles.content}>
              <Text style={styles.title}>Wachtwoord wijzigen</Text>

              <TextInput
                style={styles.input}
                placeholder="Huidig wachtwoord"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholderTextColor="#666"
              />

              <TextInput
                style={styles.input}
                placeholder="Nieuw wachtwoord"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                placeholderTextColor="#666"
              />

              <TextInput
                style={styles.input}
                placeholder="Nieuw wachtwoord (herhaal)"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor="#666"
              />

              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                onPress={handleChangePassword}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Bezig..." : "Opslaan"}
                </Text>
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#3eaf4f",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#ffffffee",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#e0e6ea",
    color: "#111",
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#f7941e",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "stretch",
    maxWidth: 400,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
});
