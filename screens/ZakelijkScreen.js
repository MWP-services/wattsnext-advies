import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ZakelijkScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zakelijk</Text>
      <Text style={styles.text}>Welkom, zakelijke klant! Dit gedeelte volgt nog.</Text>
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
