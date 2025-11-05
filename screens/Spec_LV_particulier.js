import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import ScreenBackground from '../components/ScreenBackground';

export default function Spec_LV_particulier() {
  return (
    <View style={styles.container}>
      <ScreenBackground>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>Specificaties laag voltage</Text>
            <Image
              source={require('../assets/spec-LV-particulier.jpg')}
              style={styles.image}
              resizeMode="contain"
            />
          </ScrollView>
        </SafeAreaView>
      </ScreenBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  safeArea: { flex: 1 },
  scrollContainer: { flexGrow: 1, padding: 24, alignItems: 'center' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4CAF50',
    textAlign: 'center',
  },
  image: {
    width: '200%',
    height: 550,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});
