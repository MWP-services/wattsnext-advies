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

function formatTimestamp(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

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

  const introLines = [
    'Beste Wattsnext team,',
    '',
    'Ik zou graag een afspraak inplannen naar aanleiding van het volgende advies:',
    '',
  ];

  const adviceDetails = advices.map((advice, index) => {
    const lines = [`${index + 1}. ${advice.title || 'Advies'}`];
    if (advice.summary) {
      lines.push(`Samenvatting: ${advice.summary}`);
    }
    const timestamp = formatTimestamp(advice.updatedAt || advice.savedAt);
    if (timestamp) {
      lines.push(`Opgeslagen op: ${timestamp}`);
    }
    return lines.join('\n');
  });

  const outroLines = [
    '',
    'Kunt u contact met mij opnemen om een afspraak in te plannen?',
    '',
    'Met vriendelijke groet,',
    '',
    '[Uw naam]',
    '[Bedrijfsnaam]',
    '[Telefoonnummer]',
  ];

  return [...introLines, adviceDetails.join('\n\n'), ...outroLines].join('\n');
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
      if (Array.isArray(parsed)) {
        const sorted = [...parsed].sort((a, b) => {
          const timeA = new Date(a.updatedAt || a.savedAt || 0).getTime();
          const timeB = new Date(b.updatedAt || b.savedAt || 0).getTime();
          return timeB - timeA;
        });
        setAdvices(sorted);
      } else {
        setAdvices([]);
      }
    } catch (error) {
      console.error('Adviezen ophalen mislukt', error);
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
    if (!advices || advices.length === 0) {
      Alert.alert(
        'Geen adviezen beschikbaar',
        'Sla eerst een advies op voordat u een e-mail opstelt.'
      );
      return;
    }

    const mailtoUrl = `mailto:${SALES_EMAIL_ADDRESS}?subject=${encodeURIComponent(
      EMAIL_SUBJECT
    )}&body=${encodeURIComponent(buildEmailBody(advices))}`;

    try {
      const supported = await Linking.canOpenURL(mailtoUrl);
      if (!supported) {
        Alert.alert(
          'E-mail openen niet mogelijk',
          'Er staat geen e-mailapp ingesteld op dit apparaat.'
        );
        return;
      }

      await Linking.openURL(mailtoUrl);
    } catch (error) {
      console.error('E-mail openen mislukt', error);
      Alert.alert(
        'E-mail openen mislukt',
        'Er ging iets mis bij het openen van uw e-mailapp. Probeer het later opnieuw.'
      );
    }
  }, [advices]);

  const renderAdvice = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      {item.summary ? <Text style={styles.cardSummary}>{item.summary}</Text> : null}
      {item.savedAt ? (
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
              keyExtractor={item => item.id}
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
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3eaf4f',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  loader: {
    marginTop: 32,
  },
  emptyState: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#3eaf4f',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  listContent: {
    paddingBottom: 24,
    gap: 16,
  },
  emailButton: {
    backgroundColor: '#1f6f34',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f6f34',
    marginBottom: 8,
  },
  cardSummary: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  cardDate: {
    fontSize: 14,
    color: '#666',
  },
});
