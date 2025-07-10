import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();

  return (
    <ImageBackground
      source={require('../assets/achtergrond.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
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
            style={[
              styles.button,
              { width: width > 768 ? 300 : '80%' },
            ]}
            onPress={() => navigation.navigate('Stap 1')}
          >
            <Text style={[styles.buttonText, { fontSize: width > 768 ? 20 : 18 }]}>
              Start Advies
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1, // 🔑 vult altijd het hele scherm
  },
  safeArea: {
    flex: 1, // 🔑 SafeAreaView vult het hele scherm, ook op iPhone met notch
  },
  container: {
    flex: 1, // 🔑 View vult SafeAreaView
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    maxWidth: 1200, // optioneel voor web: max breedte
    alignSelf: 'center', // center op web-breedte
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
});
