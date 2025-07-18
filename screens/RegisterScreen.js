// screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert('Gelukt', 'Account aangemaakt');
        navigation.navigate('LoginScreen');
      })
      .catch(error => {
        Alert.alert('Fout', error.message);
      });
  };

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Registreren</Text>
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Wachtwoord"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button title="Maak account" onPress={handleRegister} />
    </View>
  );
}
