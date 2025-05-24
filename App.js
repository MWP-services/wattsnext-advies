import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import Step1Screen from './screens/Step1Screen';
import ParticulierScreen from './screens/ParticulierScreen';
import ZakelijkScreen from './screens/ZakelijkScreen';
import Fase1Screen from './screens/Fase1Screen';
import Fase3ZekeringScreen from './screens/Fase3ZekeringScreen';
import PersoonsgegevensScreen from './screens/PersoonsgegevensScreen';
import AdviesScreen from './screens/AdviesScreen';







const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Stap 1" component={Step1Screen} />
        <Stack.Screen name="Particulier" component={ParticulierScreen} />
<Stack.Screen name="Zakelijk" component={ZakelijkScreen} />
<Stack.Screen name="Fase 1" component={Fase1Screen} />
<Stack.Screen name="Fase 3" component={Fase3ZekeringScreen} />
<Stack.Screen name="Persoonsgegevens" component={PersoonsgegevensScreen} />
<Stack.Screen name="Advies" component={AdviesScreen} />





      </Stack.Navigator>
    </NavigationContainer>
  );
}
