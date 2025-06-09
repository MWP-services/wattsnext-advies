// screens/ZakelijkOpslagScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';

export default function ZakelijkOpslagScreen({ navigation }) {
  const [pvOpwek, setPvOpwek] = useState('');
  const [buffer, setBuffer] = useState('');

  const doorgaan = () => {
    const bufferDecimaal = parseFloat(buffer) / 100;
    const autonomie = 1;
    const efficientie = 0.9;

    const benodigdKwh1 = (parseFloat(pvOpwek) * bufferDecimaal * autonomie) / efficientie;

   navigation.navigate('NoodstroomVraag', { kwh1: benodigdKwh1 });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Opslag van PV-opwek optimaliseren</Text>

        <Text style={styles.label}>Dagelijkse PV-opwek (kWh)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={pvOpwek}
          onChangeText={setPvOpwek}
        />

        <Text style={styles.label}>Gewenste buffer (%)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={buffer}
          onChangeText={setBuffer}
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
    marginBottom: 30,
    textAlign: 'center'
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
