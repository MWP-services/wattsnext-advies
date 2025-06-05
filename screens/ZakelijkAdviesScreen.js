import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function ZakelijkAdviesScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { benodigdKWh1, noodstroom } = route.params;

  useEffect(() => {
    const totaalKWh = parseFloat(benodigdKWh1) * (noodstroom ? 1.1 : 1); // +10% bij noodstroom

    // Zelfde matching als particulier (gebaseerd op opties)
    const opties = [7.5, 10, 12.5, 15, 17.5, 20];
    const gekozen = opties.find(optie => totaalKWh <= optie) || 20;

    // Voor nu sturen we naar bestaande adviesschermen (kan later zakelijk-specifiek)
    switch (gekozen) {
      case 7.5:
        navigation.replace('Advies 7.5 kWh Hoog');
        break;
      case 10:
        navigation.replace('Advies 10 kWh Hoog');
        break;
      case 12.5:
        navigation.replace('Advies 12.5 kWh Hoog');
        break;
      case 15:
        navigation.replace('Advies 15 kWh Hoog');
        break;
      case 17.5:
        navigation.replace('Advies 17.5 kWh Hoog');
        break;
      case 20:
        navigation.replace('Advies 20 kWh Hoog');
        break;
      default:
        navigation.replace('Advies 20 kWh Hoog');
    }
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#f7941e" />
      <Text style={styles.text}>Zakelijk advies wordt berekend...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'
  },
  text: {
    marginTop: 20, fontSize: 16
  }
});
