import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function Advies15Hoog({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Persoonlijk Advies</Text>
      <Text style={styles.text}>Op basis van uw gegevens adviseert WattsNext:</Text>
      <Text style={styles.advice}>15 kWh batterijopslag (Hoog Voltage)</Text>

      <Image
        source={require('../assets/15-KWH-ADVIES.jpg')}
        style={styles.image}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.specButton} onPress={() => navigation.navigate('Specificaties')}>
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
    marginBottom: 16,
    textAlign: 'center'
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
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
  }
});
