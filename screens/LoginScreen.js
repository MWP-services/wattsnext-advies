// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        navigation.navigate('HomeScreen'); // of waar je klant heen moet na login
      })
      .catch(error => {
        Alert.alert('Fout', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inloggen</Text>
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Wachtwoord"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button title="Log in" onPress={handleLogin} />
      <Text onPress={() => navigation.navigate('RegisterScreen')} style={styles.link}>
        Geen account? Registreer
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
  title: { fontSize: 24, marginBottom: 20 },
  link: { color: 'blue', marginTop: 10, textAlign: 'center' },
});
