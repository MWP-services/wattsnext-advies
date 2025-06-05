import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function Specificaties5kWhScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Specificaties 5 kWh Batterij</Text>
      <Image
        source={require('../assets/5-KWH-SPECIFICATIES.jpg')} // pas dit aan naar jouw exacte bestandsnaam
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 20
  },
  title: {
    fontSize: 20, fontWeight: 'bold', marginBottom: 20
  },
  image: {
    width: '100%',
    height: 400,
  }
});
