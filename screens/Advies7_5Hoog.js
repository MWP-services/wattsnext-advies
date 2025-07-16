import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, SafeAreaView } from 'react-native';

export default function Advies7_5Hoog({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/achtergrond.png')}
      style={styles.background}
      resizeMode="cover" // Of 'contain' als je dat mooier vindt
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Persoonlijk Advies</Text>
          <Text style={styles.text}>
            Op basis van uw gegevens adviseert WattsNext:
          </Text>
          <Text style={styles.advice}>7,5 kWh batterijopslag (Hoog Voltage)</Text>

          <Image
            source={require('../assets/7.5-KWH-ADVIES.jpg')}
            style={styles.image}
            resizeMode="contain"
          />

          <TouchableOpacity
            style={styles.specButton}
            onPress={() => navigation.navigate('../assets/spec-HV-particulier.png')}
          >
            <Text style={styles.specButtonText}>Bekijk specificaties</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3eaf4f',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  advice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f7941e',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 370,
    height: 400,
    marginBottom: -20,
  },
  specButton: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#3eaf4f',
    borderRadius: 8,
  },
  specButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
