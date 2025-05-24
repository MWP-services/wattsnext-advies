import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';

export default function PersoonsgegevensScreen({ navigation }) {
  const [verbruik, setVerbruik] = useState('');
  const [vermogenWp, setVermogenWp] = useState('');
  const [aantalPanelen, setAantalPanelen] = useState('');

const doorgaan = () => {
  navigation.navigate('Advies', {
    verbruik,
    vermogenWp,
    aantalPanelen
  });
};


  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Vul je gegevens in</Text>

        <Text style={styles.label}>Jaarlijks stroomverbruik (kWh)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={verbruik}
          onChangeText={setVerbruik}
        />

        <Text style={styles.label}>Vermogen per zonnepaneel (Wp)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={vermogenWp}
          onChangeText={setVermogenWp}
        />

        <Text style={styles.label}>Aantal zonnepanelen</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={aantalPanelen}
          onChangeText={setAantalPanelen}
        />

        <TouchableOpacity style={styles.button} onPress={doorgaan}>
          <Text style={styles.buttonText}>Ga verder</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3eaf4f',
    marginBottom: 30
  },
  label: {
    fontSize: 16,
    alignSelf: 'flex-start',
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: '100%'
  },
  button: {
    backgroundColor: '#f7941e',
    padding: 16,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18
  }
});
