import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  SafeAreaView
} from 'react-native';

export default function PeakNoodstroomVraagScreen({ navigation, route }) {
  const { kwh1 } = route.params;

  const [kritischVerbruik, setKritischVerbruik] = useState('');
  const [backuptijd, setBackuptijd] = useState('');

  const handleJa = () => {
    const v = parseFloat(kritischVerbruik);
    const t = parseFloat(backuptijd);
    if (isNaN(v) || isNaN(t) || v <= 0 || t <= 0) {
      alert("Vul geldige getallen in.");
      return;
    }

    const kwh2 = (v * t) / 0.9;
    navigation.navigate('PeakEnergieHandelVraag', { kwh1, kwh2 });
  };

  const handleNee = () => {
    navigation.navigate('PeakEnergieHandelVraag', { kwh1, kwh2: 0 });
  };

  return (
    <ImageBackground
  source={require('../assets/achtergrond.png')}
  style={styles.background}
  resizeMode="contain" // 🔄 of probeer ook "stretch"
  imageStyle={styles.imageStyle} // 🔧 web-only tweak
>

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={80}
        >
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Wilt u ruimte overhouden voor noodstroom?</Text>

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

            <TouchableOpacity style={styles.button} onPress={handleJa}>
              <Text style={styles.buttonText}>Ja, bereken en ga verder</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: '#aaa' }]} onPress={handleNee}>
              <Text style={styles.buttonText}>Nee, ga verder</Text>
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
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
},

imageStyle: {
  resizeMode: 'contain',
  position: 'absolute',
  width: '100%',
  height: '100%',
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
    backgroundColor: '#fff', // wit voor goede leesbaarheid
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
