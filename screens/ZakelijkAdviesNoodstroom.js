// screens/ZakelijkAdviesNoodstroom.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

export default function ZakelijkAdviesNoodstroom({ route, navigation }) {
  const { kwh1, kwh2 } = route.params;
  const totaalKwh = kwh1 + kwh2;

  let advies = '';
  let afbeelding = '';

  if (totaalKwh <= 64) {
    advies = '64 kWh batterij';
    afbeelding = require('../assets/64-KWH-ZAKELIJK.png');
  } else if (totaalKwh <= 96) {
    advies = '96 kWh batterij';
    afbeelding = require('../assets/96-KWH-ZAKELIJK.png');
  } else if (totaalKwh <= 232) {
    advies = '232 kWh batterij';
    afbeelding = require('../assets/232-KWH-ZAKELIJK.png');
  } else if (totaalKwh < 2090) {
    advies = '232 kWh batterij met modules';
    afbeelding = require('../assets/232-KWH-ZAKELIJK.png');
  } else {
    advies = '5.01 MWh batterij';
    afbeelding = require('../assets/5-MW-ZAKELIJK.png');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Advies Noodstroomvoorziening</Text>
      <Text style={styles.result}>Benodigde opslagcapaciteit: {totaalKwh.toFixed(1)} kWh</Text>
      <Text style={styles.result}>Aanbevolen oplossing: {advies}</Text>

      <Image source={afbeelding} style={styles.image} resizeMode="contain" />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
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
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4CAF50',
    textAlign: 'center'
  },
  result: {
    fontSize: 16,
    marginVertical: 8,
    textAlign: 'center'
  },
  image: {
    width: '100%',
    height: 250,
    marginVertical: 20
  },
  button: {
    backgroundColor: '#f7941e',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    width: '100%'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
