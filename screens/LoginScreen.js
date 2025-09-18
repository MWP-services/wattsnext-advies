import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const { width } = useWindowDimensions();

  const handleLogin = async () => {
    console.log('Inloggen met:', email);
    try {
      await signInWithEmailAndPassword(auth, email, wachtwoord);
      navigation.replace('HomeScreen'); // of 'Stap 1' of ander gewenst scherm
    } catch (error) {
      alert(error.message);
    }
  };

  // >>> Belangrijk voor App Review (4.2.2 + 5.1.1):
  // Toon direct de interactieve Adviseur zonder account.
  const handleGuest = () => {
    console.log('Doorgaan als gast');
    navigation.reset({ index: 0, routes: [{ name: 'AdvisorWizard' }] });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Achtergrondafbeelding */}
      <Image
        source={require('../assets/achtergrond.png')}
        style={styles.backgroundImage}
        accessible
        accessibilityLabel="Achtergrond"
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Image
            source={require('../assets/logo.png')}
            style={{
              width: width > 768 ? 300 : 200,
              height: width > 768 ? 120 : 80,
              marginBottom: 40,
            }}
            resizeMode="contain"
            accessible
            accessibilityLabel="WattsNext logo"
          />

          <Text
            style={[styles.title, { fontSize: width > 768 ? 32 : 24 }]}
            accessibilityRole="header"
          >
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
            textContentType="emailAddress"
            accessibilityLabel="Vul je e-mailadres in"
            testID="emailInput"
          />

          <TextInput
            placeholder="Wachtwoord"
            placeholderTextColor="#aaa"
            value={wachtwoord}
            onChangeText={setWachtwoord}
            style={styles.input}
            secureTextEntry
            textContentType="password"
            accessibilityLabel="Vul je wachtwoord in"
            testID="passwordInput"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            accessibilityRole="button"
            accessibilityLabel="Log in"
            testID="loginButton"
          >
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('RegisterScreen')}
            style={styles.link}
            accessibilityRole="button"
            accessibilityLabel="Ga naar registreren"
            testID="registerLink"
          >
            <Text style={styles.linkText}>Nog geen account? Registreer hier</Text>
          </TouchableOpacity>

          {/* Doorgaan als gast → directe toegang tot Adviseur */}
          <TouchableOpacity
            style={styles.guestButton}
            onPress={handleGuest}
            accessibilityRole="button"
            accessibilityLabel="Doorgaan als gast, ga direct naar de Thuisbatterij-Adviseur"
            testID="guestButton"
          >
            <Text style={styles.guestButtonText}>Doorgaan als gast</Text>
            <Text style={styles.guestHint}>
              Je kunt de app ook zonder account gebruiken
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: Platform.OS === 'web' ? 'contain' : 'cover',
    zIndex: -1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    maxWidth: 1200,
    alignSelf: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3eaf4f',
    textAlign: 'center',
  },
  input: {
    width: '80%',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#f7941e',
    padding: 16,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  guestButton: {
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    width: '80%',
    backgroundColor: '#888',
    alignItems: 'center',
  },
  guestButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  guestHint: {
    marginTop: 6,
    color: '#f1f1f1',
    fontSize: 12,
  },
  link: {
    marginTop: 16,
  },
  linkText: {
    color: '#1a73e8',
    textDecorationLine: 'underline',
  },
});
Compare