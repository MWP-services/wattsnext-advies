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
          <View style={[styles.container, { maxWidth: width > 1200 ? 1200 : '100%' }]}>
            <Image
              source={require('../assets/logo.png')}
              style={{
                width: width > 1024 ? 300 : 200,
                height: width > 1024 ? 120 : 80,
                resizeMode: 'contain',
                marginBottom: 40,
              }}
            />
            <Text
              style={{
                fontSize: width > 768 ? 36 : 24,
                fontWeight: 'bold',
                marginBottom: 20,
                color: '#3eaf4f',
                textAlign: 'center',
              }}
            >
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
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
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
