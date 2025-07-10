import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/achtergrond.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Image
            source={require('../assets/logo.png')}
            style={[
              styles.logo,
              { width: width > 1024 ? 300 : 200, height: width > 1024 ? 120 : 80 },
            ]}
            resizeMode="contain"
          />
          <Text style={styles.title}>WattsNext Advies</Text>
          <TouchableOpacity
            style={[styles.button, { width: width > 768 ? 300 : '80%' }]}
            onPress={() => navigation.navigate('Stap 1')}
          >
            <Text style={styles.buttonText}>Start Advies</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: width > 1024 ? 48 : 24,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 1200,
    alignSelf: 'center',
  },
  logo: {
    marginBottom: 40,
  },
  title: {
    fontSize: width > 768 ? 36 : 24,
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
    fontSize: width > 768 ? 20 : 18,
    fontWeight: '600',
  },
});
