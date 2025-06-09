import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function ZakelijkAdviesScreen({ navigation, route }) {
  const { kwh1, kwh2, kwh3 } = route.params;
  console.log("kwh1:", kwh1, "kwh2:", kwh2, "kwh3:", kwh3);
  const k0 = kwh1 + kwh2 + kwh3;

  let advies = '';
  let image = null;

  if (k0 <= 64) {
    advies = '64 kWh batterij';
    image = require('../assets/64-KWH-ZAKELIJK.png');
  } else if (k0 <= 96) {
    advies = '96 kWh batterij';
    image = require('../assets/96-KWH-ZAKELIJK.png');
  } else if (k0 <= 232) {
    advies = '232 kWh batterij (modulair uitbreidbaar)';
    image = require('../assets/232-KWH-ZAKELIJK.png');
  } else if (k0 <= 2090) {
    advies = '2.09 MWh batterij (modulair uitbreidbaar)';
    image = require('../assets/2-MW-ZAKELIJK.png');
  } else {
    advies = '5.01 MWh batterij (modulair uitbreidbaar)';
    image = require('../assets/5-MW-ZAKELIJK.png');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Advies op maat</Text>
      <Text style={styles.text}>Benodigd vermogen: {k0.toFixed(2)} kWh</Text>
      <Text style={styles.text}>Aanbevolen oplossing: {advies}</Text>

      {image && <Image source={image} style={styles.image} resizeMode="contain" />}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Specificaties')}>
        <Text style={styles.buttonText}>Bekijk specificaties</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 24,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4CAF50', // groene titel
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#FF7F00', // oranje knop
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
