import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ImageBackground,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { SAVED_ADVICES_STORAGE_KEY } from '../components/SaveAdviceButton';

const SALES_EMAIL_ADDRESS = 'r.oskam@wattsnext.energy';
const EMAIL_SUBJECT = 'Afspraak inplannen naar aanleiding van mijn advies';

function normalizeSavedAdvices(value) {
  if (!value) return [];
  const rawEntries = Array.isArray(value)
    ? value
    : (value && typeof value === 'object')
    ? Object.values(value)
    : [];

  const seen = new Map();

  rawEntries.filter(Boolean).forEach((entry, index) => {
    const idCandidate = entry?.id ?? entry?.key ?? `advice-${index}`;
    const normalised = {
      ...entry,
      id: String(idCandidate),
      title:
        typeof entry?.title === 'string' && entry.title.trim().length > 0
          ? entry.title.trim()
          : 'Advies',
      summary:
        typeof entry?.summary === 'string' && entry.summary.trim().length > 0
          ? entry.summary.trim()
          : '',
      savedAt: entry?.savedAt ?? entry?.timestamp ?? null,
      updatedAt: entry?.updatedAt ?? null,
    };

    const existing = seen.get(normalised.id);
    if (!existing) {
      seen.set(normalised.id, normalised);
      return;
    }
    const existingTime = new Date(existing.updatedAt || existing.savedAt || 0).getTime();
    const candidateTime = new Date(normalised.updatedAt || normalised.savedAt || 0).getTime();
    if (candidateTime >= existingTime) {
      seen.set(normalised.id, normalised);
    }
  });

  return Array.from(seen.values());
}

function formatTimestamp(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

function buildEmailBody(advices) {
  if (!advices || advices.length === 0) {
    return [
      'Beste Wattsnext team,',
      '',
      'Ik zou graag een afspraak inplannen om mijn advies te bespreken.',
      '',
      'Met vriendelijke groet,',
      '',
      '[Uw naam]',
      '[Bedrijfsnaam]',
      '[Telefoonnummer]',
    ].join('\n');
  }

  const intro = [
    'Beste Wattsnext team,',
    '',
    'Ik zou graag een afspraak inplannen naar aanleiding van het volgende advies:',
    '',
  ];

  const details = advices.map((advice, i) => {
    const lines = [`${i + 1}. ${advice.title || 'Advies'}`];
    if (advice.summary) lines.push(`Samenvatting: ${advice.summary}`);
    const ts = formatTimestamp(advice.updatedAt || advice.savedAt);
    if (ts) lines.push(`Opgeslagen op: ${ts}`);
    return lines.join('\n');
  });

  const outro = [
    '',
    'Kunt u contact met mij opnemen om een afspraak in te plannen?',
    '',
    'Met vriendelijke groet,',
    '',
    '[Uw naam]',
    '[Bedrijfsnaam]',
    '[Telefoonnummer]',
  ];

  return [...intro, details.join('\n\n'), ...outro].join('\n');
}

export default function SavedAdvicesScreen() {
  const [advices, setAdvices] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAdvices = useCallback(async () => {
    try {
      setLoading(true);
      const raw = await AsyncStorage.getItem(SAVED_ADVICES_STORAGE_KEY);
      if (!raw) {
        setAdvices([]);
        return;
      }
      const parsed = JSON.parse(raw);
      const normalised = normalizeSavedAdvices(parsed);
      const sorted = [...normalised].sort((a, b) => {
        const timeA = new Date(a.updatedAt || a.savedAt || 0).getTime();
        const timeB = new Date(b.updatedAt || b.savedAt || 0).getTime();
        return timeB - timeA;
      });
      setAdvices(sorted);
    } catch (e) {
      console.error('Adviezen ophalen mislukt', e);
      setAdvices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAdvices();
    }, [loadAdvices])
  );

  const handleComposeEmail = useCallback(async () => {
    const mailtoUrl = `mailto:${SALES_EMAIL_ADDRESS}?subject=${encodeURIComponent(
      EMAIL_SUBJECT
    )}&body=${encodeURIComponent(buildEmailBody(advices))}`;

    try {
      const supported = await Linking.canOpenURL(mailtoUrl);
      if (!supported) {
        Alert.alert('E-mail openen niet mogelijk', 'Er staat geen e-mailapp ingesteld op dit apparaat.');
        return;
      }
      await Linking.openURL(mailtoUrl);
    } catch (error) {
      console.error('E-mail openen mislukt', error);
      Alert.alert('E-mail openen mislukt', 'Er ging iets mis bij het openen van uw e-mailapp. Probeer het later opnieuw.');
    }
  }, [advices]);

  const renderAdvice = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      {item.summary ? <Text style={styles.cardSummary}>{item.summary}</Text> : null}
      {item.savedAt || item.updatedAt ? (
        <Text style={styles.cardDate}>
          Opgeslagen op: {formatTimestamp(item.updatedAt || item.savedAt)}
        </Text>
      ) : null}
    </View>
  );

  return (
    <ImageBackground
      source={require('../assets/achtergrond.png')}
      style={styles.background}
      resizeMode="contain"
      imageStyle={styles.imageStyle}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Opgeslagen adviezen</Text>
          <Text style={styles.subtitle}>
            Bewaar adviezen via de knoppen op de adviesschermen en bekijk ze hier terug.
          </Text>

          <TouchableOpacity style={styles.emailButton} onPress={handleComposeEmail}>
            <Text style={styles.emailButtonText}>Plan een afspraak via e-mail</Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size="large" color="#f7941e" style={styles.loader} />
          ) : advices.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Nog geen adviezen opgeslagen</Text>
              <Text style={styles.emptyText}>
                Keer terug naar het advies en gebruik de knop "Bewaar advies" om het op te slaan.
              </Text>
            </View>
          ) : (
            <FlatList
              data={advices}
              keyExtractor={(item, index) => item.id || `advice-${index}`}
              renderItem={renderAdvice}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  imageStyle: { resizeMode: 'contain', position: 'absolute', width: '100%', height: '100%' },
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#3eaf4f', textAlign: 'center',
