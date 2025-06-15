import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

export default function PeakShavingScreen({ navigation }) {
  const [mode, setMode] = useState('kW'); // 'kW' of 'A'
  const [net, setNet] = useState('');
  const [piek, setPiek] = useState('');
  const [duur, setDuur] = useState('');
  const [frequentie, setFrequentie] = useState('');
  const [vermogensfactor, setVermogensfactor] = useState('0.95');

  const efficientie = 0.9;
  const lijnspanning = 400; // voor Ampère-berekening

  const handleNext = () => {
    const n = parseFloat(net);
    const p = parseFloat(piek);
    const d = parseFloat(duur);
    const f = parseFloat(frequentie);
    const vf = parseFloat(vermogensfactor);

    if ([n, p, d, f].some(isNaN) || d <= 0 || f <= 0 || p <= 0 || n <= 0 || isNaN(vf)) {
      alert("Vul geldige getallen in voor alle velden.");
      return;
    }

    let kwh1 = 0;

    if (mode === 'kW') {
      kwh1 = ((p - n) * d * f) / efficientie;
    } else {
      const verschilA = p - n;
      kwh1 = ((Math.sqrt(3) * lijnspanning * verschilA * vf) * d * f) / efficientie;
    }

    if (kwh1 < 0) {
      alert("Piekbelasting moet groter zijn dan netaansluiting.");
      return;
    }

    navigation.navigate('NoodstroomVraag', { kwh1 });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Peak Shaving</Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, mode === 'kW' && styles.toggleSelected]}
            onPress={() => setMode('kW')}
          >
            <Text style={styles.toggleText}>Invoer in kW</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, mode === 'A' && styles.toggleSelected]}
            onPress={() => setMode('A')}
          >
            <Text style={styles.toggleText}>Invoer in Ampère</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Netaansluiting ({mode})</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={net} onChangeText={setNet} />

        <Text style={styles.label}>Gemeten piekbelasting ({mode})</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={piek} onChangeText={setPiek} />

        <Text style={styles.label}>Duur van de piek (uren)</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={duur} onChangeText={setDuur} />

        <Text style={styles.label}>Frequentie per dag</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={frequentie} onChangeText={setFrequentie} />

        {mode === 'A' && (
          <>
            <Text style={styles.label}>Vermogensfactor (standaard 0.95)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={vermogensfactor} onChangeText={setVermogensfactor} />
          </>
        )}

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Ga verder</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#4CAF50',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    width: '100%',
  },
  button: {
    backgroundColor: '#FF7F00',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  toggleSelected: {
    backgroundColor: '#4CAF50',
  },
  toggleText: {
    color: '#000',
    fontSize: 16,
  },
});
