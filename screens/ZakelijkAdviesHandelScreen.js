

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function ZakelijkAdviesHandelScreen({ route, navigation }) {
  const { kwh1, kwh2 = 0 } = route.params;
  const totaleBehoefte = kwh1 + kwh2;

  let advies = '';
  if (totaleBehoefte <= 64) {
    advies = 'Advies: 64 kWh batterij';
  } else if (totaleBehoefte <= 96) {
    advies = 'Advies: 96 kWh batterij';
  } else if (totaleBehoefte <= 232) {
    advies = 'Advies: 232 kWh batterij (modulair uitbreidbaar)';
  } else if (totaleBehoefte <= 2090) {
    advies = 'Advies: 2.09 MWh batterij (modulair uitbreidbaar)';
  } else {
    advies = 'Advies: 5.01 MWh batterij (modulair uitbreidbaar)';
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Advies - Handel op energiemarkt</Text>
      <Text style={styles.info}>Totale energiebehoefte: {totaleBehoefte.toFixed(2)} kWh</Text>
      <Text style={styles.advice}>{advies}</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ZakelijkDoel')}>
        <Text style={styles.buttonText}>Terug naar start</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  advice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f7941e',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#f7941e',
    padding: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
