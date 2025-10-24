import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import SaveAdviceButton from '../components/SaveAdviceButton';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ZakelijkAdviesScreen({ navigation, route }) {
  const { kwh1 = 0, kwh2 = 0, kwh3 = 0 } = route.params;

  console.log("Zakelijk Advies → kwh1:", kwh1, "kwh2:", kwh2, "kwh3:", kwh3);

  const k0 = kwh1 + kwh2 + kwh3;
  console.log("Totale behoefte (k0):", k0);

  let advies = '';
  let image = null;
  let specificatieScreen = '';

  if (k0 <= 64) {
    advies = '64 kWh batterij';
    image = require('../assets/64-KWH-ZAKELIJK.png');
    specificatieScreen = 'Specificaties64';
  } else if (k0 <= 96) {
    advies = '96 kWh batterij';
    image = require('../assets/96-KWH-ZAKELIJK.png');
    specificatieScreen = 'Specificaties96';
  } else if (k0 <= 232) {
    advies = '232 kWh batterij (modulair uitbreidbaar)';
    image = require('../assets/232-KWH-ZAKELIJK.png');
    specificatieScreen = 'Specificaties232';
  } else if (k0 <= 2090) {
    advies = '2.09 MWh batterij (modulair uitbreidbaar)';
    image = require('../assets/2-MW-ZAKELIJK.png');
    specificatieScreen = 'Specificaties209';
  } else {
    advies = '5.01 MWh batterij (modulair uitbreidbaar)';
    image = require('../assets/5-MW-ZAKELIJK.png');
    specificatieScreen = 'Specificaties501';
  }

  console.log("Gekozen advies:", advies);
  console.log("Navigeren naar:", specificatieScreen);

  return (
    <ImageBackground
  source={require('../assets/achtergrond.png')}
  style={styles.background}
  resizeMode="contain" // 🔄 of probeer ook "stretch"
  imageStyle={styles.imageStyle} // 🔧 web-only tweak
>

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Advies op maat</Text>
          <Text style={styles.text}>Benodigd vermogen: {k0.toFixed(2)} kWh</Text>
          <Text style={styles.text}>Aanbevolen oplossing: {advies}</Text>

          {image && <Image source={image} style={styles.image} resizeMode="contain" />}

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(specificatieScreen)}
          >
            <Text style={styles.buttonText}>Bekijk specificaties</Text>
          </TouchableOpacity>

          <SaveAdviceButton
            advice={{
              id: `zakelijk-${specificatieScreen}`,
              title: `Zakelijk advies: ${advies}`,
              summary: `Benodigd vermogen: ${k0.toFixed(2)} kWh. Aanbevolen oplossing: ${advies}.`,
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
 background: {
  flex: 1,
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
},

imageStyle: {
  resizeMode: 'contain',
  position: 'absolute',
  width: '100%',
  height: '100%',
},

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4CAF50',
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
    backgroundColor: '#FF7F00',
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
