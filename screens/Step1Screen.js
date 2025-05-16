import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Step1Screen({ navigation }) {
  const [selected, setSelected] = useState(null);

  const options = [
    'Woning / particulier',
    'MKB',
    'Onderwijsinstelling',
    'Agrarisch bedrijf',
    'Overheidsinstantie'
  ];

  const handleSelect = (option) => {
    setSelected(option);
    // hier kunnen we in de toekomst data opslaan
    // en doorgaan naar stap 2
    navigation.navigate('Stap 2'); // nog aan te maken
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stap 1: Kies je organisatie</Text>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.button, selected === option && styles.buttonSelected]}
          onPress={() => handleSelect(option)}
        >
          <Text style={styles.buttonText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20
  },
  title: {
    fontSize: 22, fontWeight: 'bold', color: '#3eaf4f', marginBottom: 20, textAlign: 'center'
  },
  button: {
    backgroundColor: '#f7941e',
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center'
  },
  buttonSelected: {
    backgroundColor: '#ffb347'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  }
});