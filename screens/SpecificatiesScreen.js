import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function SpecificatiesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Specificaties</Text>
      <Image
        source={require('../assets/5-KWH-SPECIFICATIES.jpg')} // de vaste afbeelding
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
    height: 400
  }
});
