import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';
import SaveAdviceButton from '../components/SaveAdviceButton';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ZakelijkAdviesPeakScreen({ route, navigation }) {
  const { kwh1, kwh2 = 0, kwh3 = 0 } = route.params;

  const totaleBehoefteOrigineel = kwh1 + kwh2 + kwh3;
  const totaleBehoefte = totaleBehoefteOrigineel * 2; // ✨ Keer 2

  console.log('Peak Advies → kwh1:', kwh1, 'kwh2:', kwh2, 'kwh3:', kwh3);
  console.log('Totale behoefte (origineel):', totaleBehoefteOrigineel);
  console.log('Totale behoefte (x2):', totaleBehoefte);

  let advies = '';
  let image = null;
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
    const modules = Math.ceil(totaleBehoefte / 232);
    advies = `232 kWh batterij met ${modules} module${modules > 1 ? 's' : ''}`;
    image = require('../assets/232-KWH-ZAKELIJK.png');
    specificatieScreen = 'Specificaties232';
    console.log('Aantal modules:', modules);
  } else if (totaleBehoefte <= 2090) {
    advies = '2.09 MWh batterij';
    image = require('../assets/2-MW-ZAKELIJK.png');
    specificatieScreen = 'Specificaties209';
  } else {
    advies = '5.01 MWh batterij';
    image = require('../assets/5-MW-ZAKELIJK.png');
    specificatieScreen = 'Specificaties501';
  }

  console.log('Gekozen advies:', advies);
  console.log('Navigeren naar:', specificatieScreen);

  return (
    <ImageBackground
  source={require('../assets/achtergrond.png')}
  style={styles.background}
  resizeMode="contain" // 🔄 of probeer ook "stretch"
  imageStyle={styles.imageStyle} // 🔧 web-only tweak
>

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
        >
          <Text style={styles.title}>Advies op maat</Text>
          <Text style={styles.info}>
            Totale energiebehoefte: {totaleBehoefte.toFixed(1)} kWh
          </Text>
          <Text style={styles.advice}>{advies}</Text>

          {image && (
            <Image source={image} style={styles.image} resizeMode="contain" />
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(specificatieScreen)}
          >
            <Text style={styles.buttonText}>Bekijk specificaties</Text>
          </TouchableOpacity>

          <SaveAdviceButton
            advice={{
              id: `zakelijk-peak-${specificatieScreen}`,
              title: `Peak advies: ${advies}`,
              summary: `Totale energiebehoefte: ${totaleBehoefte.toFixed(1)} kWh. Aanbevolen oplossing: ${advies}.`,
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

  container: {
    flexGrow: 1,
    minHeight: '100%',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 10,
    textAlign: 'center',
  },
  advice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f7941e',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    marginVertical: 20,
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
