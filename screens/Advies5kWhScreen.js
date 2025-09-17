import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AdviceEmailButton from '../components/AdviceEmailButton';
import { createAdvicePayload } from '../utils/createAdvicePayload';

const adviceImage = require('../assets/5-KWH-ADVIES.jpg');

export default function Advies5kWhScreen({ navigation, route }) {
  const emailPayload = useMemo(
    () =>
      createAdvicePayload({
        routeParams: route?.params,
        client: { type: 'Particulier' },
        advice: {
          title: 'Persoonlijk Advies',
          summary: 'Je hebt gekozen voor een 1-fase aansluiting met een 16A zekering.',
          capacity: route?.params?.adviesCapacity ?? '5 kWh batterijopslag',
          connection: route?.params?.aansluiting ?? '1-fase',
          image: adviceImage,
          inputs: {
            verbruik: route?.params?.verbruik,
            vermogenWp: route?.params?.vermogenWp,
            aantalPanelen: route?.params?.aantalPanelen,
          },
        },
        reference: { prefix: 'ADV-5' },
      }),
    [route?.params]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Persoonlijk Advies</Text>

      <Text style={styles.text}>
        Je hebt gekozen voor een 1-fase aansluiting met een 16A zekering.
      </Text>

      <Image
        source={adviceImage} // vervang door .webp als dat nodig is
        style={styles.image}
        resizeMode="contain"
      />

      <AdviceEmailButton payload={emailPayload} style={styles.emailButton} />

      <TouchableOpacity style={styles.specButton} onPress={() => navigation.navigate('5 kWh Specificaties')}>
        <Text style={styles.specButtonText}>Bekijk specificaties</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3eaf4f',
    marginBottom: 10,
    marginTop: -90,
    textAlign: 'center'
  },
  text: {
    fontSize: 16,
    marginBottom: -20,
    textAlign: 'center'
  },
  advice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7941e',
    marginBottom: 20,
    textAlign: 'center'
  },
  image: {
    width: 370,
    height: 400,
    marginBottom: -20
  },
  specButton: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#3eaf4f',
    borderRadius: 8
  },
  specButtonText: {
    color: '#fff',
    fontSize: 16
  },
  emailButton: {
    marginTop: 24,
  }
});
