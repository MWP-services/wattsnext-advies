import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import { sendAdviceByEmail } from '../utils/sendAdviceByEmail';

const DEFAULT_LABEL = 'Verstuur advies per e-mail';

const showSuccessMessage = (message) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert('Succes', message);
  }
};

const showFallbackMessage = (message) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert('Let op', message);
  }
};

const showErrorMessage = (errorMessage) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(errorMessage, ToastAndroid.LONG);
  } else {
    Alert.alert('Verzenden mislukt', errorMessage);
  }
};

export default function AdviceEmailButton({
  payload,
  label = DEFAULT_LABEL,
  style,
  textStyle,
  onSuccess,
  onError,
}) {
  const [loading, setLoading] = useState(false);

  const disabled = useMemo(() => loading || !payload, [loading, payload]);

  const handlePress = useCallback(async () => {
    if (!payload || loading) {
      return;
    }

    setLoading(true);

    try {
      const result = await sendAdviceByEmail(payload, {
        onComposerOpen: () =>
          showSuccessMessage('De e-mail wordt klaargezet in je standaard mail-app.'),
      });

      if (result?.method === 'share') {
        showFallbackMessage('Mailen is niet beschikbaar. We openen de deelopties.');
      } else if (result?.method === 'mailto') {
        showFallbackMessage('Mailcomposer ontbreekt. We openen een mailto-link.');
      }

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('AdviceEmailButton: sendAdviceByEmail failed', error);
      showErrorMessage(
        error?.message || 'Het versturen van het advies is niet gelukt. Probeer het opnieuw.'
      );

      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, onError, onSuccess, payload]);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled}
      style={[styles.button, disabled && styles.buttonDisabled, style]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.label, textStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f7941e',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

