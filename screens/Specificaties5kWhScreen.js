import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Image } from 'react-native';
import ScreenBackground from '../components/ScreenBackground';

export default function Specificaties5kWhScreen() {
  return (
    <View style={styles.container}>
      <ScreenBackground>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <Text style={styles.title}>Specificaties 5 kWh Batterij</Text>
            <Image
              source={require('../assets/5-KWH-SPECIFICATIES.jpg')} // pas dit aan naar jouw exacte bestandsnaam
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </SafeAreaView>
      </ScreenBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  safeArea: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20, fontWeight: 'bold', marginBottom: 20
  },
  image: {
    width: '100%',
    height: 400,
  }
});
