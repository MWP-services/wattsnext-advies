// screens/AccountBeherenScreen.js
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import ScreenBackground from '../components/ScreenBackground';

export default function AccountBeherenScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const tryDelete = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Niet ingelogd', 'Log opnieuw in en probeer het nogmaals.');
      navigation.replace('LoginScreen');
      return;
    }

    try {
      setLoading(true);
      await deleteUser(user); // alleen Auth verwijderen
      setLoading(false);
      Alert.alert('Account verwijderd', 'Je account is definitief verwijderd.');
      navigation.replace('LoginScreen');
    } catch (err) {
      setLoading(false);
      if (err?.code === 'auth/requires-recent-login') {
        Alert.alert(
          'Bevestiging nodig',
          'Om veiligheidsredenen moet je je opnieuw aanmelden voordat je je account kunt verwijderen.'
        );
      } else {
        Alert.alert('Fout', err?.message ?? 'Het verwijderen is mislukt. Probeer het opnieuw.');
      }
    }
  };

  const handleDeletePress = () => {
    Alert.alert(
      'Account definitief verwijderen?',
      'Dit kan niet ongedaan worden gemaakt. Al je gegevens worden gewist.',
      [
        { text: 'Annuleer', style: 'cancel' },
        { text: 'Ja, verwijder', style: 'destructive', onPress: tryDelete },
      ]
    );
  };

  const handleReauthenticate = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Niet ingelogd', 'Log opnieuw in en probeer het nogmaals.');
      navigation.replace('LoginScreen');
      return;
    }

    try {
      setLoading(true);
      if (!user.email) {
        setLoading(false);
        Alert.alert('Opnieuw inloggen vereist', 'Log opnieuw in via het inlogscherm en kom hier terug.');
        navigation.navigate('LoginScreen');
        return;
      }
      const cred = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, cred);
      setLoading(false);
      Alert.alert('Bevestigd', 'Je bent opnieuw ingelogd. Je kunt nu je account verwijderen.');
    } catch (e) {
      setLoading(false);
      Alert.alert('Onjuist wachtwoord', 'Controleer je wachtwoord en probeer opnieuw.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenBackground>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              <Text style={styles.title}>Account beheren</Text>
              <Text style={styles.body}>
                Hier kun je je account permanent verwijderen. Dit is onomkeerbaar en verwijdert je gegevens.
              </Text>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={handleDeletePress}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={styles.deleteText}>Verwijder mijn account</Text>
                )}
              </TouchableOpacity>

              <View style={{ height: 24 }} />

              <Text style={styles.subTitle}>Problemen met verwijderen?</Text>
              <Text style={styles.body}>
                Soms is een recente aanmelding nodig. Log dan opnieuw in, of voer hieronder je wachtwoord in als je met
                e-mail en wachtwoord bent ingelogd.
              </Text>

              <TextInput
                placeholder="Wachtwoord (alleen voor e-mail/password accounts)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={handleReauthenticate}
                disabled={loading}
              >
                <Text style={styles.outlineText}>Opnieuw verifiëren</Text>
              </TouchableOpacity>

              <View style={{ height: 16 }} />
              <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.linkText}>← Terug</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ScreenBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  safeArea: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
  content: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8, color: '#3eaf4f', textAlign: 'center' },
  subTitle: { fontSize: 18, fontWeight: '700', marginTop: 8, marginBottom: 4 },
  body: { fontSize: 15, textAlign: 'center', maxWidth: 500, opacity: 0.9 },
  deleteBtn: {
    marginTop: 20,
    backgroundColor: '#d32f2f',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 10,
    minWidth: 260,
    alignItems: 'center',
  },
  deleteText: { color: '#fff', fontWeight: '700' },
  outlineBtn: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
    minWidth: 260,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
  },
  outlineText: { color: '#333', fontWeight: '600' },
  linkBtn: { paddingVertical: 10, paddingHorizontal: 12 },
  linkText: { color: '#1a73e8', fontWeight: '600' },
  input: {
    marginTop: 10,
    width: 300,
    maxWidth: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
