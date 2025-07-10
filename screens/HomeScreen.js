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
        <View style={styles.wrapper}>
          <Image
            source={require('../assets/logo.png')}
            style={{
              width: width > 1024 ? 300 : 200,
              height: width > 1024 ? 120 : 80,
              resizeMode: 'contain',
              marginBottom: 40,
            }}
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
  safeArea: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',   // 💚 centreren op Y-as
    alignItems: 'center',       // 💚 centreren op X-as
    paddingHorizontal: 24,
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
    fontSize: 18,
    fontWeight: '600',
  },
});
