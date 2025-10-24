// screens/RegisterScreen.js
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import Toast from 'react-native-toast-message';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore/lite'; // 👈 Lite!
import { auth, dbLite } from '../firebaseConfig';       // 👈 Lite!

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [naam, setNaam] = useState('');
  const [bedrijf, setBedrijf] = useState('');
  const [kwh, setKwh] = useState('');
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();

  const handleRegister = async () => {
    if (!email || !password || !naam || !bedrijf || !kwh) {
      Toast.show({ type: 'info', text1: 'Let op', text2: 'Vul alle velden in.' });
      return;
    }
    const kwhVal = parseFloat(String(kwh).replace(',', '.'));
    if (Number.isNaN(kwhVal) || kwhVal <= 0) {
      Toast.show({ type: 'info', text1: 'Let op', text2: 'Voer een geldig positief getal in voor kWh.' });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      Toast.show({ type: 'info', text1: 'Let op', text2: 'Voer een geldig e-mailadres in.' });
      return;
    }

    try {
      setLoading(true);

      // 1) Auth-account aanmaken (snel)
      const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const uid = user.uid;

      // 2) Profiel wegschrijven via Firestore Lite (REST); op de achtergrond, UI niet blokkeren
      setDoc(doc(dbLite, 'klanten', uid), {
        email: email.trim(),
        naam: naam.trim(),
        bedrijf: bedrijf.trim(),
        stroomverbruik: kwhVal,
        aangemaaktOp: new Date(),
      }).catch((e) => console.log('Profiel write (background) fout:', e?.message));

      setLoading(false);

      // 3) Succes-toast + vlot door naar Login
      Toast.show({ type: 'success', text1: 'Account aangemaakt', text2: 'Je kunt nu inloggen.' });
      setTimeout(() => navigation.replace('LoginScreen'), 900);
    } catch (error) {
      setLoading(false);
      if (error?.code === 'auth/email-already-in-use') {
        Toast.show({ type: 'info', text1: 'E-mail in gebruik', text2: 'Log in met dit adres.' });
        setTimeout(() => navigation.replace('LoginScreen', { prefillEmail: email.trim() }), 900);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Fout bij registreren',
          text2: error?.message ?? 'Probeer het opnieuw.',
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/achtergrond.png')} style={styles.backgroundImage} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.select({ ios: 24, android: 0, default: 0 })}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
              <Image
                source={require('../assets/logo.png')}
                style={[styles.logo, { width: width > 768 ? 300 : 200, height: width > 768 ? 120 : 80 }]}
                resizeMode="contain"
              />
              <Text style={[styles.title, { fontSize: width > 768 ? 32 : 24 }]}>Account aanmaken</Text>

              <TextInput placeholder="Naam" value={naam} onChangeText={setNaam} style={styles.input} />
              <TextInput placeholder="Bedrijf" value={bedrijf} onChangeText={setBedrijf} style={styles.input} />
              <TextInput
                placeholder="Jaarlijks stroomverbruik (kWh)"
                value={kwh}
                onChangeText={setKwh}
                keyboardType="decimal-pad"
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
                placeholder="Wachtwoord"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                onSubmitEditing={handleRegister}
              />

              <TouchableOpacity
                style={[styles.button, { width: width > 768 ? 300 : '80%' }, loading && { opacity: 0.7 }]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Maak account aan</Text>}
              </TouchableOpacity>

              <Text style={styles.link} onPress={() => navigation.navigate('LoginScreen')}>
                Heb je al een account? Log in
              </Text>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  backgroundImage: {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    resizeMode: Platform.OS === 'web' ? 'contain' : 'cover',
    zIndex: -1,
  },
  safeArea: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    maxWidth: 1200,
    alignSelf: 'center',
    gap: 16,
  },
  logo: { marginBottom: 20 },
  title: { fontWeight: 'bold', color: '#3eaf4f', textAlign: 'center' },
  input: {
    width: '80%',
    maxWidth: 400,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#f7941e',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 18 },
  link: { color: '#007bff', marginTop: 12 },
});
