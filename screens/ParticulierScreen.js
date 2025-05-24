import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ParticulierScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wat voor aansluiting heb je thuis?</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Fase 1')}
      >
        <Text style={styles.buttonText}>1-fase aansluiting</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Fase 3')}
      >
        <Text style={styles.buttonText}>3-fase aansluiting</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20
  },
  title: {
    fontSize: 22, fontWeight: 'bold', color: '#3eaf4f', marginBottom: 30, textAlign: 'center'
  },
  button: {
    backgroundColor: '#f7941e',
    padding: 16,
    borderRadius: 10,
    marginVertical: 12,
    width: '100%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18
  }
});
