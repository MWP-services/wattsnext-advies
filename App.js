import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import Step1Screen from './screens/Step1Screen';
import Step2Screen from './screens/Step2Screen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Stap 1" component={Step1Screen} />
        <Stack.Screen name="Stap 2" component={Step2Screen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
