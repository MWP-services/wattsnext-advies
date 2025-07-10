import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ImageBackground, SafeAreaView
} from 'react-native';

export default function ParticulierScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/achtergrond.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Wat voor aansluiting heb je thuis?</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Fase 1', { aansluiting: '1-fase' })}
          >
            <Text style={styles.buttonText}>1-fase aansluiting</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Fase 3', { aansluiting: '3-fase' })}
          >
            <Text style={styles.buttonText}>3-fase aansluiting</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3eaf4f',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#f7941e',
    padding: 16,
    borderRadius: 10,
    marginVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
