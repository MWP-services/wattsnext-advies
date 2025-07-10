import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ImageBackground,
  SafeAreaView
} from 'react-native';

export default function ZakelijkOpslagScreen({ navigation }) {
  const [jaarlijksVerbruik, setJaarlijksVerbruik] = useState('');
  const [wpPerPaneel, setWpPerPaneel] = useState('');
  const [aantalPanelen, setAantalPanelen] = useState('');

  const doorgaan = () => {
    const jaarlijks = parseFloat(jaarlijksVerbruik);
    const wp = parseFloat(wpPerPaneel);
    const panelen = parseFloat(aantalPanelen);

    if (isNaN(jaarlijks) || isNaN(wp) || isNaN(panelen)) {
      alert('Vul alle velden in met geldige getallen.');
      return;
    }

    // Stap 1: Jaarlijks verbruik -> dagelijks -> kWh1
    const dagelijksVerbruik = jaarlijks / 365;
    const kwh1 = dagelijksVerbruik / 2;

    // Stap 2: Zonnepanelen installatie
    const vermogenInstallatie = (wp * panelen) / 1000; // Wp naar kWp
    const kwh2 = vermogenInstallatie * 1.5;

    // Stap 3: Gemiddelde
    const totaalBenodigd = (kwh1 + kwh2) / 2;

    console.log('Zakelijk Opslag Berekening =>');
    console.log('Jaarlijks verbruik:', jaarlijks);
    console.log('Dagelijks verbruik:', dagelijksVerbruik.toFixed(2));
    console.log('kWh1:', kwh1.toFixed(2));
    console.log('Wp per paneel:', wp);
    console.log('Aantal panelen:', panelen);
    console.log('Vermogen installatie:', vermogenInstallatie.toFixed(2));
    console.log('kWh2:', kwh2.toFixed(2));
    console.log('Totaal benodigd:', totaalBenodigd.toFixed(2));

    navigation.navigate('NoodstroomVraag', { kwh1: totaalBenodigd });
  };

  return (
    <ImageBackground
      source={require('../assets/achtergrond.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Opslag van PV-opwek optimaliseren</Text>

            <Text style={styles.label}>Jaarlijks stroomverbruik (kWh)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={jaarlijksVerbruik}
              onChangeText={setJaarlijksVerbruik}
              placeholder="Bijv. 3650"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Vermogen per zonnepaneel (Wp)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={wpPerPaneel}
              onChangeText={setWpPerPaneel}
              placeholder="Bijv. 400"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Aantal zonnepanelen</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={aantalPanelen}
              onChangeText={setAantalPanelen}
              placeholder="Bijv. 12"
              placeholderTextColor="#aaa"
            />

            <TouchableOpacity style={styles.button} onPress={doorgaan}>
              <Text style={styles.buttonText}>Ga verder</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#f7941e',
    padding: 16,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
