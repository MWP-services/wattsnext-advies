import React, { useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function AdviesScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { verbruik, vermogenWp, aantalPanelen, aansluiting } = route.params;

useEffect(() => {
  const berekenAdvies = () => {
    const vpd = parseFloat(verbruik) / 365;
    const kWh1 = vpd / 2;

    const installatie = (parseFloat(vermogenWp) * parseFloat(aantalPanelen)) / 1000;
    const kWh2 = installatie * 1.5;

    const gemiddeld = (kWh1 + kWh2) / 2;

    if (aansluiting === '1-fase') {
      if (gemiddeld <= 5) {
        navigation.replace('Advies 5 kWh');
      } else {
        navigation.replace('Advies 10 kWh Laag');
      }
    } else if (aansluiting === '3-fase') {
      const opties = [7.5, 10, 12.5, 15, 17.5, 20];
      const gekozen = opties.find(o => gemiddeld <= o) || 20;

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
    }
  };

  berekenAdvies();
}, []);


  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#f7941e" />
      <Text style={styles.text}>Advies wordt berekend...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff'
  },
  text: {
    marginTop: 20, fontSize: 16
  }
});
