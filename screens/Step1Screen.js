import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Step2Screen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stap 2: Ben je particulier of zakelijk?</Text>

      <TouchableOpacity
        style={styles.button}
onPress={() => navigation.navigate('Particulier')}
      >
        <Text style={styles.buttonText}>Particulier</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
onPress={() => navigation.navigate('ZakelijkDoel')}
      >
        <Text style={styles.buttonText}>Zakelijk</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20
  },
  title: {
    fontSize: 22, fontWeight: 'bold', color: '#3eaf4f', marginBottom: 30, textAlign: 'center'
  },
  button: {
    backgroundColor: '#f7941e',
    padding: 16,
    borderRadius: 10,
    marginVertical: 12,
    width: '100%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18
  }
});
