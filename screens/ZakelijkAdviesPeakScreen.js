
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function ZakelijkAdviesPeakScreen({ route, navigation }) {
  const { kwh1, kwh2 = 0, kwh3 = 0 } = route.params;
  const totaleBehoefte = kwh1 + kwh2 + kwh3;

  let advies = '';
  let modules = 0;

  if (totaleBehoefte <= 1160) {
    // 232 kWh batterij, maximaal 5 modules
    modules = Math.ceil(totaleBehoefte / 232);
    advies = `Advies: 232 kWh batterij (${modules} module${modules > 1 ? 's' : ''})`;
  } else if (totaleBehoefte >= 5000) {
    advies = 'Advies: 5 MWh batterij';
  } else if (totaleBehoefte >= 2000) {
    advies = 'Advies: 2 MWh batterij';
  } else {
    // 1160 < behoefte < 2000 → kijk of 232 kWh goedkoper zou zijn
    modules = Math.ceil(totaleBehoefte / 232);
    const totaal232 = modules * 232;
    if (totaal232 < 2000) {
      advies = `Advies: 232 kWh batterij (${modules} modules)`;
    } else {
      advies = 'Advies: 2 MWh batterij';
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Batterijadvies: Peak Shaving</Text>

      <Text style={styles.info}>
        Totale energiebehoefte: {totaleBehoefte.toFixed(1)} kWh
      </Text>

      <Text style={styles.advice}>{advies}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ZakelijkDoel')}
      >
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
