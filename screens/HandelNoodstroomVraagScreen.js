
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

export default function HandelNoodstroomVraagScreen({ navigation, route }) {
  const { kwh1 } = route.params;
  const [kritischVerbruik, setKritischVerbruik] = useState('');
  const [backuptijd, setBackuptijd] = useState('');

  const handleNext = () => {
    const v = parseFloat(kritischVerbruik);
    const t = parseFloat(backuptijd);
    if (!isNaN(v) && !isNaN(t) && v > 0 && t > 0) {
      const kwh2 = (v * t) / 0.9;
      navigation.navigate('ZakelijkAdviesHandel', { kwh1, kwh2 });
    } else {
      alert('Vul geldige waarden in.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Noodstroomvoorziening</Text>

        <Text style={styles.label}>Benodigde capaciteit (kWh)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={kritischVerbruik}
          onChangeText={setKritischVerbruik}
          placeholder="Bijv. 5"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Backuptijd (uren)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={backuptijd}
          onChangeText={setBackuptijd}
          placeholder="Bijv. 2"
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
    marginBottom: 20,
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
