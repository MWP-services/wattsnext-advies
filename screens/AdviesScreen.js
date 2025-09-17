import React, { useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function AdviesScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const verbruik = route.params?.verbruik ?? '—';
  const vermogenWp = route.params?.vermogenWp ?? '—';
  const aantalPanelen = route.params?.aantalPanelen ?? '—';
  const aansluiting = route.params?.aansluiting ?? '—';
  const clientType = route.params?.clientType ?? 'Particulier';
  const zekering = route.params?.zekering ?? '—';

useEffect(() => {
  const berekenAdvies = () => {
    const vpd = parseFloat(verbruik) / 365;
    const kWh1 = vpd / 2;

    const installatie = (parseFloat(vermogenWp) * parseFloat(aantalPanelen)) / 1000;
    const kWh2 = installatie * 1.5;

    const gemiddeld = (kWh1 + kWh2) / 2;

    const baseParams = {
      clientType,
      aansluiting,
      verbruik,
      vermogenWp,
      aantalPanelen,
      zekering,
    };

    if (aansluiting === '1-fase') {
      if (gemiddeld <= 5) {
        navigation.replace('Advies 5 kWh', {
          ...baseParams,
          adviesCapacity: '5 kWh batterijopslag',
        });
      } else {
        navigation.replace('Advies 10 kWh Laag', {
          ...baseParams,
          adviesCapacity: '10 kWh batterijopslag (Laag Voltage)',
        });
      }
    } else if (aansluiting === '3-fase') {
      const opties = [7.5, 10, 12.5, 15, 17.5, 20];
      const gekozen = opties.find(o => gemiddeld <= o) || 20;

      switch (gekozen) {
        case 7.5:
          navigation.replace('Advies 7.5 kWh Hoog', {
            ...baseParams,
            adviesCapacity: '7.5 kWh batterijopslag (Hoog Voltage)',
          });
          break;
        case 10:
          navigation.replace('Advies 10 kWh Hoog', {
            ...baseParams,
            adviesCapacity: '10 kWh batterijopslag (Hoog Voltage)',
          });
          break;
        case 12.5:
          navigation.replace('Advies 12.5 kWh Hoog', {
            ...baseParams,
            adviesCapacity: '12.5 kWh batterijopslag (Hoog Voltage)',
          });
          break;
        case 15:
          navigation.replace('Advies 15 kWh Hoog', {
            ...baseParams,
            adviesCapacity: '15 kWh batterijopslag (Hoog Voltage)',
          });
          break;
        case 17.5:
          navigation.replace('Advies 17.5 kWh Hoog', {
            ...baseParams,
            adviesCapacity: '17.5 kWh batterijopslag (Hoog Voltage)',
          });
          break;
        case 20:
          navigation.replace('Advies 20 kWh Hoog', {
            ...baseParams,
            adviesCapacity: '20 kWh batterijopslag (Hoog Voltage)',
          });
          break;
        default:
          navigation.replace('Advies 20 kWh Hoog', {
            ...baseParams,
            adviesCapacity: '20 kWh batterijopslag (Hoog Voltage)',
          });
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
