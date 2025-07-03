// screens/LoadShiftingVraagScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function LoadShifting({ navigation }) {
  const [vermogen, setVermogen] = useState('');
  const [duur, setDuur] = useState('');

  const handleNext = () => {
    const p = parseFloat(vermogen);
    const t = parseFloat(duur);

    if (!isNaN(p) && !isNaN(t) && p > 0 && t > 0) {
      const kwh1 = (p * t) / 0.9; // Efficiëntie = 90%
      console.log("LoadShifting kwh1:", kwh1);
      navigation.navigate('LoadShiftingNoodstroomVraag', { kwh1 });
    } else {
      alert("Vul geldige waarden in.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Energie-inkoop optimaliseren (Load Shifting)</Text>

        <Text style={styles.label}>Gewenst vermogen (kW)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={vermogen}
          onChangeText={setVermogen}
          placeholder="Bijv. 50"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Duur verschuiving (uren)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={duur}
          onChangeText={setDuur}
          placeholder="Bijv. 3"
          placeholderTextColor="#aaa"
        />

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
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
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
});
