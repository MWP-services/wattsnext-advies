import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import AdviceEmailButton from '../components/AdviceEmailButton';
import { createAdvicePayload } from '../utils/createAdvicePayload';

export default function ZakelijkAdviesPeakScreen({ route, navigation }) {
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
    advies = '232 kWh batterij';
    image = require('../assets/232-KWH-ZAKELIJK.png');
  } else if (totaleBehoefte <= 1160) {
    const modules = Math.ceil(totaleBehoefte / 232);
    advies = `232 kWh batterij met ${modules} module${modules > 1 ? 's' : ''}`;
    image = require('../assets/232-KWH-ZAKELIJK.png');
  } else if (totaleBehoefte <= 2090) {
    advies = '2.09 MWh batterij';
    image = require('../assets/2-MW-ZAKELIJK.png');
  } else {
    advies = '5.01 MWh batterij';
    image = require('../assets/5-MW-ZAKELIJK.png');
  }

  const emailPayload = useMemo(
    () =>
      createAdvicePayload({
        routeParams: route?.params,
        client: { type: 'Zakelijk', company: route?.params?.clientCompany },
        advice: {
          title: 'Peak Shaving advies',
          summary: `Totale energiebehoefte: ${totaleBehoefte.toFixed(1)} kWh`,
          capacity: advies,
          connection: 'Hoog voltage',
          image,
          inputs: {
            verbruik: totaleBehoefte.toFixed(1),
            overige: `kWh invoer: ${kwh1}, ${kwh2}, ${kwh3}`,
          },
        },
        reference: { prefix: 'ZAK-PEAK' },
      }),
    [advies, image, kwh1, kwh2, kwh3, route?.params, totaleBehoefte]
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Advies op maat</Text>
      <Text style={styles.info}>Totale energiebehoefte: {totaleBehoefte.toFixed(1)} kWh</Text>
      <Text style={styles.advice}>{advies}</Text>

      {image && (
        <Image source={image} style={styles.image} resizeMode="contain" />
      )}

      <AdviceEmailButton payload={emailPayload} style={styles.emailButton} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Specificaties')}
      >
        <Text style={styles.buttonText}>Bekijk specificaties</Text>
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
  emailButton: {
    marginTop: 24,
  },
});
