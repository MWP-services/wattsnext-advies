import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Fase3Screen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>3-fase aansluiting</Text>
      <Text style={styles.text}>Welkom! Klik hieronder om verder te gaan met je 3-fase aansluiting.</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Fase 3 Zekering')}>
        <Text style={styles.buttonText}>Ga verder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20
  },
  title: {
    fontSize: 22, fontWeight: 'bold', color: '#3eaf4f', marginBottom: 10
  },
  text: {
    fontSize: 16, textAlign: 'center', marginBottom: 20
  },
  button: {
    backgroundColor: '#f7941e',
    padding: 16,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18
  }
});
