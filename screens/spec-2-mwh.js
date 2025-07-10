import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export default function Specificaties209Screen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Specificaties 2.09 MWH batterij</Text>
      <Image
        source={require('../assets/2.09-mwh-spec.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4CAF50',
    textAlign: 'center',
  },
  image: {
    width: '200%',
    height: 550,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});
