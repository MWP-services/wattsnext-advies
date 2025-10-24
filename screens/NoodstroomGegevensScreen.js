import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground
} from 'react-native';

export default function NoodstroomGegevensScreen({ navigation, route }) {
  const [verbruik, setVerbruik] = useState('');
  const [tijd, setTijd] = useState('');

  const doorgaan = () => {
    const v = parseFloat(verbruik);
    const t = parseFloat(tijd);
    if (!isNaN(v) && !isNaN(t) && v > 0 && t > 0) {
      const kwh2 = (v * t) / 0.9;
      navigation.navigate('EnergiehandelVraag', { kwh2 });
    } else {
      alert("Vul geldige waarden in.");
    }
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
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Noodstroomvoorziening</Text>

            <Text style={styles.label}>Benodigde capaciteit (kWh)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={verbruik}
              onChangeText={setVerbruik}
              placeholder="Bijv. 5"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Backuptijd (uren)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={tijd}
              onChangeText={setTijd}
              placeholder="Bijv. 2"
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
    justifyContent: 'center',
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
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#fff', // inputvelden blijven wit
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
