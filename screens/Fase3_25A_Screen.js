import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Fase3_25A_Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>3-fase 25A</Text>
      <Text style={styles.text}>Je hebt gekozen voor een 3-fase aansluiting van 25A.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20
  },
  title: {
    fontSize: 22, fontWeight: 'bold', color: '#3eaf4f', marginBottom: 20
  },
  text: {
    fontSize: 16, textAlign: 'center'
  }
});
