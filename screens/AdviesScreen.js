import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function AdviesScreen() {
  const route = useRoute();
  const { verbruik, vermogenWp, aantalPanelen } = route.params;

  const verbruikPerDag = parseFloat(verbruik) / 365;
  const kWh1 = verbruikPerDag / 2;

  const installatieVermogen = parseFloat(vermogenWp) * parseFloat(aantalPanelen) / 1000; // Wp naar kWp
  const kWh2 = installatieVermogen * 1.5;

  const gemiddeldBenodigd = (kWh1 + kWh2) / 2;

  // Bepaal adviesoptie op basis van afgeronde waarde
  const batterijOpties = [7.5, 10, 12.5, 15, 17.5, 20, 22.5];
  const gekozenOptie = batterijOpties.find(optie => gemiddeldBenodigd <= optie) || 'Meer dan 22,5 kWh nodig';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Persoonlijk Advies</Text>

      <Text style={styles.text}>
        Gebaseerd op je gegevens raden wij deze batterij aan:
      </Text>

      <Text style={styles.advies}>
        {typeof gekozenOptie === 'number'
          ? `Optie ${batterijOpties.indexOf(gekozenOptie) + 1}: ${gekozenOptie} kWh`
          : gekozenOptie}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20
  },
  title: {
    fontSize: 24, fontWeight: 'bold', color: '#3eaf4f', marginBottom: 20
  },
  text: {
    fontSize: 16, textAlign: 'center', marginBottom: 10
  },
  advies: {
    fontSize: 20, fontWeight: 'bold', color: '#f7941e', marginTop: 10
  }
});
