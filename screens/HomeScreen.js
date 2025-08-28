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
      <Image
        source={require('../assets/achtergrond.png')}
        style={styles.backgroundImage}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Terugknop */}
        <TouchableOpacity
          onPress={() => navigation.replace('LoginScreen')}
          style={styles.backTopLeft}
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
          <TouchableOpacity
            style={[styles.button, { width: width > 768 ? 300 : '80%' }]}
            onPress={() => navigation.navigate('Stap 1')}
          >
            <Text style={[styles.buttonText, { fontSize: width > 768 ? 20 : 18 }]}>
              Start Advies
            </Text>
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
