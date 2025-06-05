import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function Fase1Screen({ navigation }) {
  const route = useRoute();
  const aansluiting = route.params?.aansluiting || '1-fase'; // fallback voor zekerheid

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welke zekering heeft je 1-fase aansluiting?</Text>

      {/* 16A verwijst naar vast 5 kWh advies → geen aansluiting nodig */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Advies 5 kWh')}>
        <Text style={styles.buttonText}>16A</Text>
      </TouchableOpacity>

      {/* Deze twee verwijzen naar Persoonsgegevens + aansluiting meesturen */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Persoonsgegevens', { aansluiting })}>
        <Text style={styles.buttonText}>25A</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Persoonsgegevens', { aansluiting })}>
        <Text style={styles.buttonText}>32A</Text>
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

