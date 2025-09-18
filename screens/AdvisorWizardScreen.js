import { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';

const Field = ({ label, value, setValue, keyboardType = 'numeric' }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={{ fontWeight: '600', marginBottom: 6 }}>{label}</Text>
    <TextInput
      value={String(value)}
      onChangeText={(t) => setValue(t.replace(/[^0-9.]/g, ''))}
      keyboardType={keyboardType}
      placeholder="0"
      style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 10 }}
    />
  </View>
);

export default function AdvisorWizardScreen({ navigation }) {
  const [, setRoute] = useState(navigation.getState().routes.find(r => r.name === 'AdvisorWizard') || {});
  const [phase, setPhase] = useState('3-fase');   // '1-fase' of '3-fase'
  const [annualUse, setAnnualUse] = useState('3500'); // kWh/jaar
  const [pvAnnual, setPvAnnual] = useState('2500');   // kWh/jaar
  const [autonomyHours, setAutonomyHours] = useState('12'); // uren

  const calc = useMemo(() => {
    const use = parseFloat(annualUse || '0');
    const pv = parseFloat(pvAnnual || '0');
    const autonomy = Math.max(0, parseFloat(autonomyHours || '0'));
    const dailyUse = use / 365;
    const dailyPv = pv / 365;
    const netDaily = Math.max(0, dailyUse - dailyPv * 0.6); // aanname 60% directe zelfconsumptie
    const need = netDaily * (autonomy / 24);
    return { need };
  }, [annualUse, pvAnnual, autonomyHours]);

  const recommendation = useMemo(() => {
    const n = Math.max(0, calc.need);
    if (phase === '1-fase') {
      if (n <= 10) return { label: '10 kWh Laag Voltage (1-fase)', size: 10 };
      return { label: 'Overweeg 3-fase Hoog Voltage opties (>10 kWh)', size: Math.ceil(n) };
    }
    const buckets = [7.5, 10, 12.5, 15, 17.5, 20];
    for (let b of buckets) if (n <= b) return { label: `${b} kWh Hoog Voltage (3-fase)`, size: b };
    return { label: `> 20 kWh (3-fase) – modulaire oplossing`, size: Math.ceil(n) };
  }, [calc.need, phase]);

  const goOfferte = () => {
    navigation.navigate('OfferteAanvraag', {
      phase, annualUse, pvAnnual, autonomyHours,
      need: calc.need, recommendation: recommendation.label,
    });
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Thuisbatterij-Adviseur</Text>

      <Text style={{ fontWeight: '600', marginBottom: 6 }}>Type aansluiting</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
        {['1-fase','3-fase'].map(p => (
          <Pressable
            key={p}
            onPress={() => setPhase(p)}
            style={{
              paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10,
              borderWidth: 1, borderColor: phase===p?'#111827':'#e5e7eb',
              backgroundColor: phase===p?'#111827':'white'
            }}>
            <Text style={{ color: phase===p?'white':'#111827' }}>{p}</Text>
          </Pressable>
        ))}
      </View>

      <Field label="Jaarverbruik (kWh)" value={annualUse} setValue={setAnnualUse} />
      <Field label="PV-opwek (kWh/jaar)" value={pvAnnual} setValue={setPvAnnual} />
      <Field label="Gewenste autonomie (uren)" value={autonomyHours} setValue={setAutonomyHours} />

      <View style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 14, marginTop: 4 }}>
        <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 6 }}>Resultaat</Text>
        <Text>Netto behoefte: <Text style={{ fontWeight: '700' }}>{calc.need.toFixed(2)} kWh</Text></Text>
        <Text style={{ marginTop: 6 }}>Advies: <Text style={{ fontWeight: '700' }}>{recommendation.label}</Text></Text>
        <Text style={{ color: '#6b7280', marginTop: 8 }}>* Indicatief o.b.v. 60% directe zelfconsumptie.</Text>
      </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
          <Pressable
            onPress={goOfferte}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 10,
              backgroundColor: '#2563eb',
            }}
          >
            <Text style={{ color: 'white', fontWeight: '700' }}>Vraag offerte aan</Text>
          </Pressable>
          </View>
      </ScrollView>
