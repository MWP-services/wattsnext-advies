import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function ZakelijkDoelScreen({ navigation }) {
  const opties = [
    'PV-opwek optimaliseren',
    'Peak shaving',
    'Netcongestie',
    'Noodstroomvoorziening',
    'Load shifting',
    'Handel op energiemarkten'
  ];

  const handleKeuze = (doel) => {
  if (doel === 'PV-opwek optimaliseren') {
    navigation.navigate('ZakelijkOpslag');
  } else if (doel === 'Peak shaving') {
    navigation.navigate('PeakShaving');
  } else if (doel === 'Netcongestie') {
    navigation.navigate('Netcongestie');
  } else if (doel === 'Noodstroomvoorziening') {
  navigation.navigate('Noodstroomvoorziening');
 } else if (doel === 'Load shifting') {
  navigation.navigate('LoadShiftingVraagScreen'); 
  } else if (doel === 'Handel op energiemarkten') {
  navigation.navigate('HandelEnergieHandelVraagScreen');

}

};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Wat is het doeleinde voor de batterij?</Text>

      {opties.map((optie, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={() => handleKeuze(optie)}
        >
          <Text style={styles.buttonText}>{optie}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3eaf4f',
    marginBottom: 24,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#f7941e',
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
  }
});
