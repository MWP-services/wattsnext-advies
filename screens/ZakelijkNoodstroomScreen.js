import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ZakelijkNoodstroomScreen() {
  const [kritischVermogen, setKritischVermogen] = useState('');
  const [backuptijd, setBackuptijd] = useState('');

  const route = useRoute();
  const navigation = useNavigation();
  const { benodigdKWh1 } = route.params;

  const efficientie = 0.9;

  const doorgaan = () => {
    const vermogen = parseFloat(kritischVermogen);
    const tijd = parseFloat(backuptijd);

    if (isNaN(vermogen) || isNaN(tijd)) {
      Alert.alert('Ongeldige invoer', 'Vul beide velden correct in.');
      return;
    }

    const kWh2 = (vermogen * tijd) / efficientie;

    navigation.navigate('ZakelijkEnergiehandelVraag', {
      benodigdKWh1: parseFloat(benodigdKWh1),
      benodigdKWh2: kWh2.toFixed(2)
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Noodstroomvoorziening</Text>

        <Text style={styles.label}>Benodigde capaciteit (kWh)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={kritischVermogen}
          onChangeText={setKritischVermogen}
        />

        <Text style={styles.label}>Backuptijd (uren)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={backuptijd}
          onChangeText={setBackuptijd}
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
    flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 24
  },
  title: {
    fontSize: 22, fontWeight: 'bold', color: '#3eaf4f', marginBottom: 24
  },
  label: {
    fontSize: 16, alignSelf: 'flex-start', marginBottom: 8
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 20, width: '100%'
  },
  button: {
    backgroundColor: '#f7941e', padding: 16, borderRadius: 10, width: '100%', alignItems: 'center'
  },
  buttonText: {
    color: '#fff', fontSize: 18
  }
});
