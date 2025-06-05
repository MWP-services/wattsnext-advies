import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function EnergiehandelVraagScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { kwh2 } = route.params;

  const handleKeuze = (keuze) => {
    navigation.navigate('OverzichtZakelijkAdvies', {
      kwh2,
      energiehandel: keuze
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wil je deelnemen aan energiehandel?</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleKeuze('Ja')}>
        <Text style={styles.buttonText}>Ja</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleKeuze('Nee')}>
        <Text style={styles.buttonText}>Nee</Text>
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
    marginVertical: 10,
    width: '100%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18
  }
});
