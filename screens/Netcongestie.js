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
  ImageBackground,
  SafeAreaView
} from 'react-native';

export default function Netcongestie({ navigation }) {
  const [stroombelasting, setStroombelasting] = useState('');
  const [netaansluiting, setNetaansluiting] = useState('');
  const [duur, setDuur] = useState('');

  const handleNext = () => {
    const stroom = parseFloat(stroombelasting);
    const net = parseFloat(netaansluiting);
    const t = parseFloat(duur);
    const v = 0.95; // vaste vermogensfactor
    const efficientie = 0.9;

    if (!isNaN(stroom) && !isNaN(net) && !isNaN(t)) {
      const verschilAmp = ((stroom - net) * v * t) / efficientie;

      if (verschilAmp <= 0) {
        alert("De stroombelasting moet hoger zijn dan de netaansluiting.");
        return;
      }

      const aanbevolenCapaciteit = verschilAmp * 0.658 * 2;

      console.log('Netcongestie berekening:');
      console.log('Verschil in Ampère:', verschilAmp.toFixed(2));
      console.log('Aanbevolen capaciteit (kWh1):', aanbevolenCapaciteit.toFixed(2));

      navigation.navigate('NetcongestieNoodstroomVraag', { kwh1: aanbevolenCapaciteit });
    } else {
      alert("Vul alle velden in met geldige getallen.");
    }
  };

  return (
    <ImageBackground
      source={require('../assets/achtergrond.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={80}
        >
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Netcongestie Berekening</Text>

            <Text style={styles.info}>
              
            </Text>

            <Text style={styles.label}>Gemiddelde stroombelasting (A)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={stroombelasting}
              onChangeText={setStroombelasting}
              placeholder="Bijv. 160 A"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Netaansluiting (A)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={netaansluiting}
              onChangeText={setNetaansluiting}
              placeholder="Bijv. 125 A"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Congestieduur per dag (uren)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={duur}
              onChangeText={setDuur}
              placeholder="Bijv. 3 uur"
              placeholderTextColor="#aaa"
            />

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Bereken en ga verder</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#4CAF50',
  },
  info: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
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
    backgroundColor: '#fff',
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
