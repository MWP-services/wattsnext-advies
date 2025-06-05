import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function OverzichtZakelijkAdviesScreen({ route, navigation }) {
  const { kwh1, kwh2, energiehandel } = route.params;

  const kwhTotaal = parseFloat(kwh1) + parseFloat(kwh2);

  // Zakelijk aanbod (alle hoog voltage)
  const zakelijkeOpties = [
    { capaciteit: 7.5, naam: '7.5 kWh Zakelijk', afbeelding: require('../assets/7.5-KWH-ADVIES.jpg') },
    { capaciteit: 10, naam: '10 kWh Zakelijk', afbeelding: require('../assets/10-KWH-ADVIES.jpg') },
    { capaciteit: 12.5, naam: '12.5 kWh Zakelijk', afbeelding: require('../assets/12.5-KWH-ADVIES.jpg') },
    { capaciteit: 15, naam: '15 kWh Zakelijk', afbeelding: require('../assets/15-KWH-ADVIES.jpg') },
    { capaciteit: 17.5, naam: '17.5 kWh Zakelijk', afbeelding: require('../assets/17.5-KWH-ADVIES.jpg') },
    { capaciteit: 20, naam: '20 kWh Zakelijk', afbeelding: require('../assets/20-KWH-ADVIES.jpg') },
  ];

  // Kies eerste optie die groter of gelijk is aan totaalbehoefte
  const gekozen = zakelijkeOpties.find(optie => kwhTotaal <= optie.capaciteit) || { naam: 'Meer dan 20 kWh nodig', afbeelding: null };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zakelijk Advies</Text>
      <Text style={styles.subtext}>Benodigd totaal: {kwhTotaal.toFixed(1)} kWh</Text>

      {gekozen.afbeelding && (
        <Image source={gekozen.afbeelding} style={styles.image} resizeMode="contain" />
      )}

      <Text style={styles.advies}>{gekozen.naam}</Text>

      {energiehandel && (
        <Text style={styles.subtext}>Energiehandel gewenst: {energiehandel}</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Terug naar begin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20
  },
  title: {
    fontSize: 24, fontWeight: 'bold', color: '#3eaf4f', marginBottom: 10
  },
  subtext: {
    fontSize: 16, marginBottom: 10
  },
  advies: {
    fontSize: 20, fontWeight: 'bold', color: '#f7941e', marginVertical: 20, textAlign: 'center'
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 20
  },
  button: {
    backgroundColor: '#f7941e',
    padding: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18
  }
});
