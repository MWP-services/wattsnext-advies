// screens/HomeScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  useWindowDimensions,
  ImageBackground,
  Platform,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      {/* Achtergrondlaag */}
      <Image
        source={require('../assets/achtergrond.png')}
        style={styles.backgroundImage}
      />

      {/* Voorgrond: content */}
      <SafeAreaView style={styles.safeArea}>
        {/* Terugknop */}
        <TouchableOpacity
          onPress={() => navigation.replace('LoginScreen')}
          style={styles.backTopLeft}
          accessibilityRole="button"
          accessibilityLabel="Terug naar log-in"
        >
          <Text style={styles.backText}>← Terug naar log-in</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Image
            source={require('../assets/logo.png')}
            style={[
              styles.logo,
              {
                width: width > 768 ? 300 : 200,
                height: width > 768 ? 120 : 80,
              },
            ]}
            resizeMode="contain"
          />

          <Text style={[styles.title, { fontSize: width > 768 ? 36 : 24 }]}>
            WattsNext Advies
          </Text>

          {/* Start Advies */}
          <TouchableOpacity
            style={[styles.button, { width: width > 768 ? 300 : '80%' }]}
            onPress={() => navigation.navigate('Stap 1')}
            accessibilityRole="button"
            accessibilityLabel="Start Advies"
          >
            <Text style={[styles.buttonText, { fontSize: width > 768 ? 20 : 18 }]}>
              Start Advies
            </Text>
          </TouchableOpacity>

          {/* Spacing */}
          <View style={{ height: 16 }} />

          {/* NIEUW: Account beheren */}
          <TouchableOpacity
            style={[styles.secondaryButton, { width: width > 768 ? 300 : '80%' }]}
            onPress={() => navigation.navigate('AccountBeheren')}
            accessibilityRole="button"
            accessibilityLabel="Account beheren"
          >
            <Text style={[styles.secondaryButtonText, { fontSize: width > 768 ? 18 : 16 }]}>
              Account beheren
            </Text>
          </TouchableOpacity>

          <View style={{ height: 16 }} />

          <TouchableOpacity
            style={[styles.secondaryButton, { width: width > 768 ? 300 : '80%' }]}
            onPress={() => navigation.navigate('SavedAdvices')}
            accessibilityRole="button"
            accessibilityLabel="Bekijk opgeslagen adviezen"
          >
            <Text style={[styles.secondaryButtonText, { fontSize: width > 768 ? 18 : 16 }]}>Opgeslagen adviezen</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    // Op web liever 'contain' om uitrekken te voorkomen, native 'cover' voor full-bleed
    resizeMode: Platform.OS === 'web' ? 'contain' : 'cover',
    zIndex: -1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    maxWidth: 1200,
    alignSelf: 'center',
  },
  logo: {
    marginBottom: 40,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3eaf4f',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#f7941e',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#ffffffee',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f7941e',
  },
  secondaryButtonText: {
    color: '#f7941e',
    fontWeight: '600',
  },
  backTopLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ffffffcc',
    borderRadius: 10,
    zIndex: 10,
  },
  backText: {
    color: '#1a73e8',
    fontSize: 16,
    fontWeight: '500',
  },
});
