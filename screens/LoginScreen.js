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
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { width } = useWindowDimensions();

  const handleLogin = () => {
    console.log('Login:', { email, password });

    if (!email || !password) return;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => navigation.replace('HomeScreen'))
      .catch(error => alert(error.message));
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
          <Text style={[styles.title, { fontSize: width > 768 ? 32 : 24 }]}>Inloggen</Text>

          <TextInput
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Wachtwoord"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity style={[styles.button, { width: width > 768 ? 300 : '80%' }]} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>

          <Text style={styles.link} onPress={() => navigation.navigate('RegisterScreen')}>
            Nog geen account? Registreer
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
