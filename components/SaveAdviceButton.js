import React, { useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SAVED_ADVICES_STORAGE_KEY = '@wattsnext/saved_advices';

export default function SaveAdviceButton({ advice, label = 'Bewaar advies', style, textStyle }) {
  const [formVisible, setFormVisible] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const openForm = async () => {
    if (!advice || !advice.id) {
      Alert.alert('Opslaan niet mogelijk', 'Advies mist een id en kan niet opgeslagen worden.');
      return;
    }

    try {
      setFormLoading(true);
      const raw = await AsyncStorage.getItem(SAVED_ADVICES_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const stored = Array.isArray(parsed) ? parsed : Object.values(parsed || {});
      const existing = stored.find(item => item?.id === advice.id);

      setCompanyName(existing?.companyName ?? '');
      setCompanyAddress(existing?.companyAddress ?? '');
      setCustomerEmail(existing?.customerEmail ?? '');
    } catch (error) {
      console.error('Formulier openen mislukt', error);
      setCompanyName('');
      setCompanyAddress('');
      setCustomerEmail('');
      Alert.alert(
        'Gegevens laden mislukt',
        'De eerder ingevulde gegevens konden niet geladen worden. Vul ze opnieuw in.'
      );
    } finally {
      setFormLoading(false);
      setFormVisible(true);
    }
  };

  const closeForm = () => {
    if (saving) return;
    setFormVisible(false);
  };

  const handleSave = async () => {
    const trimmedCompanyName = companyName.trim();
    const trimmedCompanyAddress = companyAddress.trim();
    const trimmedCustomerEmail = customerEmail.trim();

    if (trimmedCompanyName.length === 0) {
      Alert.alert('Naam bedrijf verplicht', 'Vul de naam van het bedrijf in.');
      return;
    }

    if (trimmedCompanyAddress.length === 0) {
      Alert.alert('Adres bedrijf verplicht', 'Vul het adres van het bedrijf in.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedCustomerEmail)) {
      Alert.alert('Ongeldig e-mailadres', 'Vul een geldig e-mailadres van de klant in.');
      return;
    }

    try {
      setSaving(true);
      const raw = await AsyncStorage.getItem(SAVED_ADVICES_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const stored = Array.isArray(parsed) ? parsed : Object.values(parsed || {});
      const timestamp = new Date().toISOString();

      const existingIndex = stored.findIndex(item => item.id === advice.id);
      let updated = [];

      if (existingIndex > -1) {
        updated = [...stored];
        const previous = updated[existingIndex];
        updated[existingIndex] = {
          ...previous,
          ...advice,
          companyName: trimmedCompanyName,
          companyAddress: trimmedCompanyAddress,
          customerEmail: trimmedCustomerEmail,
          savedAt: previous.savedAt || timestamp,
          updatedAt: timestamp,
        };
      } else {
        updated = [
          ...stored,
          {
            ...advice,
            companyName: trimmedCompanyName,
            companyAddress: trimmedCompanyAddress,
            customerEmail: trimmedCustomerEmail,
            savedAt: timestamp,
          },
        ];
      }

      await AsyncStorage.setItem(SAVED_ADVICES_STORAGE_KEY, JSON.stringify(updated));
      setFormVisible(false);
      Alert.alert(
        'Advies opgeslagen',
        existingIndex > -1
          ? 'Het advies is bijgewerkt in je overzicht.'
          : 'Het advies is toegevoegd aan je overzicht.'
      );
    } catch (error) {
      console.error('Advies opslaan mislukt', error);
      Alert.alert('Opslaan mislukt', 'Er ging iets mis bij het opslaan. Probeer het later opnieuw.');
    } finally {
      setSaving(false);
    }
  };

  const busy = saving || formLoading;

  return (
    <>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={openForm}
        style={[styles.button, style, busy ? styles.buttonDisabled : null]}
        disabled={busy}
      >
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={[styles.buttonText, textStyle]}>{label}</Text>}
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={formVisible}
        onRequestClose={closeForm}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Bewaar advies</Text>
            <Text style={styles.modalDescription}>
              Vul de bedrijfsgegevens in zodat we contact kunnen opnemen naar aanleiding van dit advies.
            </Text>

            <Text style={styles.modalLabel}>Naam bedrijf</Text>
            <TextInput
              style={styles.modalInput}
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="Naam bedrijf"
              autoCapitalize="words"
              autoCorrect={false}
              editable={!saving}
            />

            <Text style={styles.modalLabel}>Adres bedrijf</Text>
            <TextInput
              style={[styles.modalInput, styles.modalMultiline]}
              value={companyAddress}
              onChangeText={setCompanyAddress}
              placeholder="Straat, huisnummer, plaats"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              autoCapitalize="sentences"
              autoCorrect={false}
              editable={!saving}
            />

            <Text style={styles.modalLabel}>E-mailadres klant</Text>
            <TextInput
              style={styles.modalInput}
              value={customerEmail}
              onChangeText={setCustomerEmail}
              placeholder="naam@bedrijf.nl"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!saving}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={closeForm}
                style={styles.modalCancelButton}
                disabled={saving}
              >
                <Text style={styles.modalCancelText}>Annuleren</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={styles.modalSaveButton}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalSaveText}>Opslaan</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#1f6f34',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 180,
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f6f34',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f6f34',
    marginBottom: 6,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 14,
    backgroundColor: '#fff',
  },
  modalMultiline: {
    height: 90,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  modalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#1f6f34',
  },
  modalCancelText: {
    color: '#1f6f34',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSaveButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#1f6f34',
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
