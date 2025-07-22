import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  useWindowDimensions,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [naam, setNaam] = useState('');
  const [bedrijf, setBedrijf] = useState('');
  const [kwh, setKwh] = useState('');
  const { width } = useWindowDimensions();

  const handleRegister = async () => {
    console.log('Registreren:', { email, naam, bedrijf, kwh });

    if (!email || !password || !naam || !bedrijf || !kwh) {
      Alert.alert('Let op', 'Vul alle velden in.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'klanten', uid), {
        email,
        naam,
        bedrijf,
        stroomverbruik: parseFloat(kwh),
        aangemaaktOp: new Date(),
      });

      Alert.alert('Succes', 'Account is aangemaakt!');
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Fout', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/achtergrond.png')} style={styles.backgroundImage} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
            keyboardType="numeric"
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
          />

          <TouchableOpacity style={[styles.button, { width: width > 768 ? 300 : '80%' }]} onPress={handleRegister}>
            <Text style={styles.buttonText}>Maak account aan</Text>
          </TouchableOpacity>

          <Text style={styles.link} onPress={() => navigation.navigate('LoginScreen')}>
            Heb je al een account? Log in
          </Text>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
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
