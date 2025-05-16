import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Step2Screen({ navigation }) {
  const [selected, setSelected] = useState(null);

  const options = [
    '0 – 5.000 kWh',
    '5.000 – 15.000 kWh',
    '15.000 – 50.000 kWh',
    '50.000 – 100.000 kWh',
    'Meer dan 100.000 kWh',
  ];

  const handleSelect = (option) => {
    setSelected(option);
    navigation.navigate('Stap 3'); // Voorbereiding op stap 3
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stap 2: Jaarlijks verbruik</Text>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3eaf4f',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#f7941e',
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonSelected: {
    backgroundColor: '#ffb347',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});