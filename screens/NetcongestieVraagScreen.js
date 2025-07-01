import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';

export default function NetcongestieVraagScreen({ navigation }) {
  const [stroombelasting, setStroombelasting] = useState('');
  const [netaansluiting, setNetaansluiting] = useState('');
  const [duur, setDuur] = useState('');
  const [vermogensfactor, setVermogensfactor] = useState('0.95');

  const handleNext = () => {
    const stroom = parseFloat(stroombelasting);
    const net = parseFloat(netaansluiting);
    const t = parseFloat(duur);
    const v = parseFloat(vermogensfactor);

    if (!isNaN(stroom) && !isNaN(net) && !isNaN(t) && !isNaN(v)) {
      const verschil = stroom - net;
      if (verschil <= 0) {
        alert("Stroombelasting moet hoger zijn dan netaansluiting.");
        return;
      }

      const kwh1 = (Math.sqrt(3) * 400 * verschil * v * t) / 0.9;
      navigation.navigate('NetcongestieNoodstroomVraag', { kwh1 });
    } else {
      alert("Vul alle velden correct in.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Netcongestie</Text>

        <Text style={styles.label}>Gemiddelde stroombelasting (A)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={stroombelasting}
          onChangeText={setStroombelasting}
          placeholder="Bijv. 160"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Netaansluiting (A)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={netaansluiting}
          onChangeText={setNetaansluiting}
          placeholder="Bijv. 125"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Congestieduur per dag (uren)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={duur}
          onChangeText={setDuur}
          placeholder="Bijv. 3"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Vermogensfactor (standaard = 0.95)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={vermogensfactor}
          onChangeText={setVermogensfactor}
          placeholder="0.95"
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
