import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AdviceEmailButton from '../components/AdviceEmailButton';
import { createAdvicePayload } from '../utils/createAdvicePayload';

export default function ZakelijkAdviesNetcongestie({ navigation, route }) {
  const { kwh1, kwh2 = 0, kwh3 = 0 } = route.params;
  const totaleBehoefte = kwh1 + kwh2 + kwh3;

  let advies = '';
  let image = null;

  if (totaleBehoefte <= 64) {
    advies = '64 kWh batterij';
    image = require('../assets/64-KWH-ZAKELIJK.png');
  } else if (totaleBehoefte <= 96) {
    advies = '96 kWh batterij';
    image = require('../assets/96-KWH-ZAKELIJK.png');
  } else if (totaleBehoefte <= 232) {
    advies = '232 kWh batterij (modulair uitbreidbaar)';
    image = require('../assets/232-KWH-ZAKELIJK.png');
  } else if (totaleBehoefte <= 2090) {
    advies = '2.09 MWh batterij (modulair uitbreidbaar)';
    image = require('../assets/2-MW-ZAKELIJK.png');
  } else {
    advies = '5.01 MWh batterij (modulair uitbreidbaar)';
    image = require('../assets/5-MW-ZAKELIJK.png');
  }

  const emailPayload = useMemo(
    () =>
      createAdvicePayload({
        routeParams: route?.params,
        client: { type: 'Zakelijk', company: route?.params?.clientCompany },
        advice: {
          title: 'Advies Netcongestie',
          summary: `Benodigd vermogen: ${totaleBehoefte.toFixed(2)} kWh`,
          capacity: advies,
          connection: 'Hoog voltage',
          image,
          inputs: {
            verbruik: totaleBehoefte.toFixed(2),
            overige: `kWh invoer: ${kwh1}, ${kwh2}, ${kwh3}`,
          },
        },
        reference: { prefix: 'ZAK-NC' },
      }),
    [advies, image, kwh1, kwh2, kwh3, route?.params, totaleBehoefte]
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Advies op maat</Text>
      <Text style={styles.text}>Benodigd vermogen: {totaleBehoefte.toFixed(2)} kWh</Text>
      <Text style={styles.text}>Aanbevolen oplossing: {advies}</Text>

      {image && <Image source={image} style={styles.image} resizeMode="contain" />}

      <AdviceEmailButton payload={emailPayload} style={styles.emailButton} />

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
  emailButton: {
    marginTop: 24,
  },
});
