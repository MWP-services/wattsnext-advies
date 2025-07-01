// screens/LoadShiftingNoodstroomVraagScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

export default function LoadShiftingNoodstroomVraagScreen({ navigation, route }) {
  const { kwh1 } = route.params;
  const [wilNoodstroom, setWilNoodstroom] = useState(null);
  const [kritischVerbruik, setKritischVerbruik] = useState('');
  const [backupTijd, setBackupTijd] = useState('');

  const handleNee = () => {
    navigation.navigate('LoadShiftingEnergiehandelVraag', { kwh1, kwh2: 0 });
  };

  const handleNext = () => {
    const v = parseFloat(kritischVerbruik);
    const t = parseFloat(backupTijd);
    if (!isNaN(v) && !isNaN(t) && v > 0 && t > 0) {
      const kwh2 = (v * t) / 0.9; // efficiëntie 90%
      console.log("LoadShifting kwh2:", kwh2);
      navigation.navigate('LoadShiftingEnergiehandelVraag', { kwh1, kwh2 });
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
        <Text style={styles.title}>Wilt u ruimte reserveren voor noodstroomvoorziening?</Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, wilNoodstroom === true && styles.toggleSelected]}
            onPress={() => setWilNoodstroom(true)}
          >
            <Text style={styles.toggleText}>Ja</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, wilNoodstroom === false && styles.toggleSelected]}
            onPress={handleNee}
          >
            <Text style={styles.toggleText}>Nee</Text>
          </TouchableOpacity>
        </View>

        {wilNoodstroom === true && (
          <>
            <Text style={styles.label}>Kritisch verbruik (kW)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={kritischVerbruik}
              onChangeText={setKritischVerbruik}
              placeholder="Bijv. 3.5"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Backuptijd (uren)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={backupTijd}
              onChangeText={setBackupTijd}
              placeholder="Bijv. 2"
              placeholderTextColor="#aaa"
            />

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Ga verder</Text>
            </TouchableOpacity>
          </>
        )}
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
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  toggleButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 10,
    backgroundColor: '#f9f9f9',
    minWidth: 100,
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
