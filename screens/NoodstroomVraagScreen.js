// screens/NoodstroomGegevensScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';

export default function NoodstroomGegevensScreen({ navigation, route }) {
  const { kwh2 } = route.params || {};

  const [kritischVerbruik, setKritischVerbruik] = useState('');
  const [backupTijd, setBackupTijd] = useState('');

  const doorgaan = () => {
    if (!kritischVerbruik || !backupTijd) return;

    const kwh1 = (parseFloat(kritischVerbruik) * parseFloat(backupTijd)) / 0.9;

    navigation.navigate('EnergiehandelVraag', { kwh1, kwh2 });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Noodstroomvoorziening gegevens</Text>

        <Text style={styles.label}>Kritisch verbruik (kW)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={kritischVerbruik}
          onChangeText={setKritischVerbruik}
        />

        <Text style={styles.label}>Backuptijd (uren)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={backupTijd}
          onChangeText={setBackupTijd}
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
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3eaf4f',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  button: {
    backgroundColor: '#f7941e',
    padding: 16,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
