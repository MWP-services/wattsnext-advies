
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

export default function EnergieHandel({ navigation }) {
  const [pmarkt, setPmarkt] = useState('');
  const [pnet, setPnet] = useState('');
  const [activaties, setActivaties] = useState('');
  const [wiltNoodstroom, setWiltNoodstroom] = useState(null);

  const handleNext = () => {
    const markt = parseFloat(pmarkt);
    const net = parseFloat(pnet);
    const a = parseInt(activaties);

    if (!isNaN(markt) && !isNaN(net) && !isNaN(a) && markt > 0 && net > 0 && a > 0) {
      const minVermogen = Math.min(markt, net);
      const kwh1 = (minVermogen * 2 * a) / 0.9;

      if (wiltNoodstroom === true) {
        navigation.navigate('HandelNoodstroomVraag', { kwh1 });
      } else {
        navigation.navigate('ZakelijkAdviesHandel', { kwh1, kwh2: 0 });
      }
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
        <Text style={styles.title}>Handel op de energiemarkt</Text>

        <Text style={styles.label}>Gewenst verhandelbaar vermogen (kW)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={pmarkt}
          onChangeText={setPmarkt}
          placeholder="Bijv. 15"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Maximaal netaansluitingsvermogen (kW)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={pnet}
          onChangeText={setPnet}
          placeholder="Bijv. 20"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Aantal activaties per dag</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={activaties}
          onChangeText={setActivaties}
          placeholder="Bijv. 2"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Wilt u ruimte reserveren voor noodstroomvoorziening?</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, wiltNoodstroom === true && styles.toggleSelected]}
            onPress={() => setWiltNoodstroom(true)}
          >
            <Text style={styles.toggleText}>Ja</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, wiltNoodstroom === false && styles.toggleSelected]}
            onPress={() => setWiltNoodstroom(false)}
          >
            <Text style={styles.toggleText}>Nee</Text>
          </TouchableOpacity>
        </View>

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
