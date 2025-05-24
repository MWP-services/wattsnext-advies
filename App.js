import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import Step1Screen from './screens/Step1Screen';
import ParticulierScreen from './screens/ParticulierScreen';
import ZakelijkScreen from './screens/ZakelijkScreen';
import Fase1Screen from './screens/Fase1Screen';
import Fase3Screen from './screens/Fase3Screen';
import Zekerings16AScreen from './screens/Zekerings16AScreen';
import Zekerings25AScreen from './screens/Zekerings25AScreen';
import Zekerings32AScreen from './screens/Zekerings32AScreen';
import Fase3ZekeringScreen from './screens/Fase3ZekeringScreen';
import Fase3_16A_Screen from './screens/Fase3_16A_Screen';
import Fase3_25A_Screen from './screens/Fase3_25A_Screen';
import Fase3_32A_Screen from './screens/Fase3_32A_Screen';





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
<Stack.Screen name="Fase 3" component={Fase3Screen} />
<Stack.Screen name="16A" component={Zekerings16AScreen} />
<Stack.Screen name="25A" component={Zekerings25AScreen} />
<Stack.Screen name="32A" component={Zekerings32AScreen} />
<Stack.Screen name="Fase 3 Zekering" component={Fase3ZekeringScreen} />
<Stack.Screen name="3F 16A" component={Fase3_16A_Screen} />
<Stack.Screen name="3F 25A" component={Fase3_25A_Screen} />
<Stack.Screen name="3F 32A" component={Fase3_32A_Screen} />



      </Stack.Navigator>
    </NavigationContainer>
  );
}
