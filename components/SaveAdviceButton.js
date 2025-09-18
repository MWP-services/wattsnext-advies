import React, { useState } from 'react';
import { Alert, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SAVED_ADVICES_STORAGE_KEY = '@wattsnext/saved_advices';

export default function SaveAdviceButton({ advice, label = 'Bewaar advies', style, textStyle }) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!advice || !advice.id) {
      Alert.alert('Opslaan niet mogelijk', 'Advies mist een id en kan niet opgeslagen worden.');
      return;
    }

    try {
      setSaving(true);
      const raw = await AsyncStorage.getItem(SAVED_ADVICES_STORAGE_KEY);
      const stored = raw ? JSON.parse(raw) : [];
      const timestamp = new Date().toISOString();

      const existingIndex = stored.findIndex(item => item.id === advice.id);
      let updated = [];

      if (existingIndex > -1) {
        updated = [...stored];
        const previous = updated[existingIndex];
        updated[existingIndex] = {
          ...previous,
          ...advice,
          savedAt: previous.savedAt || timestamp,
          updatedAt: timestamp,
        };
      } else {
        updated = [...stored, { ...advice, savedAt: timestamp }];
      }

      await AsyncStorage.setItem(SAVED_ADVICES_STORAGE_KEY, JSON.stringify(updated));
      Alert.alert('Advies opgeslagen', existingIndex > -1 ? 'Het advies is bijgewerkt in je overzicht.' : 'Het advies is toegevoegd aan je overzicht.');
    } catch (error) {
      console.error('Advies opslaan mislukt', error);
      Alert.alert('Opslaan mislukt', 'Er ging iets mis bij het opslaan. Probeer het later opnieuw.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={handleSave}
      style={[styles.button, style]}
      disabled={saving}
    >
      {saving ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
