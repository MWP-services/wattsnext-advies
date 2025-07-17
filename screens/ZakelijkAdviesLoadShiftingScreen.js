import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, SafeAreaView } from 'react-native';

export default function ZakelijkAdviesLoadShiftingScreen({ route, navigation }) {
  const { kwh1 = 0, kwh2 = 0, kwh3 = 0 } = route.params;
  const totaleBehoefte = kwh1 + kwh2 + kwh3;
  console.log("LoadShifting Advies -> kwh1:", kwh1, "kwh2:", kwh2, "kwh3:", kwh3);
  console.log("Totale behoefte:", totaleBehoefte);

  let advies = '';
  let image = null;
  let modules = 0;
  let specificatieScreen = '';

  if (totaleBehoefte <= 64) {
    advies = '64 kWh batterij';
    image = require('../assets/64-KWH-ZAKELIJK.png');
    specificatieScreen = 'Specificaties64';
  } else if (totaleBehoefte <= 96) {
    advies = '96 kWh batterij';
    image = require('../assets/96-KWH-ZAKELIJK.png');
    specificatieScreen = 'Specificaties96';
  } else if (totaleBehoefte <= 232) {
    advies = '232 kWh batterij';
    image = require('../assets/232-KWH-ZAKELIJK.png');
    specificatieScreen = 'Specificaties232';
  } else if (totaleBehoefte <= 1160) {
    modules = Math.ceil(totaleBehoefte / 232);
    advies = `232 kWh batterij (${modules} modules)`;
    image = require('../assets/232-KWH-ZAKELIJK.png');
    specificatieScreen = 'Specificaties232';
    console.log("Aantal modules voor 232 kWh batterij:", modules);
  } else if (totaleBehoefte <= 2090) {
    advies = '2.09 MWh batterij';
    image = require('../assets/2-MW-ZAKELIJK.png');
    specificatieScreen = 'Specificaties209';
  } else {
    advies = '5.01 MWh batterij';
    image = require('../assets/5-MW-ZAKELIJK.png');
    specificatieScreen = 'Specificaties501';
  }

  console.log("Gekozen advies:", advies);
  console.log("Navigeren naar specificatie scherm:", specificatieScreen);

  return (
    <ImageBackground
      source={require('../assets/achtergrond.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Advies Load Shifting</Text>
          <Text style={styles.info}>Totale energiebehoefte: {totaleBehoefte.toFixed(1)} kWh</Text>
          <Text style={styles.info}>Aanbevolen oplossing: {advies}</Text>

          {image && (
            <Image source={image} style={styles.image} resizeMode="contain" />
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(specificatieScreen)}
          >
            <Text style={styles.buttonText}>Bekijk specificaties</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
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
  image: {
    width: '100%',
    height: 250,
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#FF7F00',
    padding: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
