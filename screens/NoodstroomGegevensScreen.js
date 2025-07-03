import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';


export default function NoodstroomGegevensScreen({ navigation, route }) {
  const [verbruik, setVerbruik] = useState('');
  const [tijd, setTijd] = useState('');

  const doorgaan = () => {
    const kwh2 = (parseFloat(verbruik) * parseFloat(tijd)) / 0.9;
    navigation.navigate('EnergiehandelVraag', { kwh2 });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Noodstroomvoorziening</Text>

      <Text style={styles.label}>Benodigde capaciteit (kWh)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={verbruik}
        onChangeText={setVerbruik}
      />

      <Text style={styles.label}>Backuptijd (uren)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={tijd}
        onChangeText={setTijd}
      />

      <TouchableOpacity style={styles.button} onPress={doorgaan}>
        <Text style={styles.buttonText}>Ga verder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20
  },
  title: {
    fontSize: 22, fontWeight: 'bold', color: '#3eaf4f', marginBottom: 30
  },
  label: {
    fontSize: 16, alignSelf: 'flex-start', marginBottom: 5
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
