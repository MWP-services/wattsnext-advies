import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Zekerings32AScreen() {
    
  return (
    <View style={styles.container}>
      <Text style={styles.title}>32A</Text>
      <Text style={styles.text}>Je hebt gekozen voor een 32A aansluiting.</Text>
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
