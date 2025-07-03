import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import Step1Screen from './screens/Step1Screen';
import ParticulierScreen from './screens/ParticulierScreen';
import Fase1Screen from './screens/Fase1Screen';
import Fase3ZekeringScreen from './screens/Fase3ZekeringScreen';
import PersoonsgegevensScreen from './screens/PersoonsgegevensScreen';
import Advies5kWhScreen from './screens/Advies5kWhScreen';
import Specificaties5kWhScreen from './screens/Specificaties5kWhScreen';
import Advies10Laag from './screens/Advies10Laag.js';
import Advies7_5Hoog from './screens/Advies7_5Hoog';
import Advies10Hoog from './screens/Advies10Hoog';
import Advies12_5Hoog from './screens/Advies12_5Hoog';
import Advies15Hoog from './screens/Advies15Hoog';
import Advies17_5Hoog from './screens/Advies17_5Hoog';
import Advies20Hoog from './screens/Advies20Hoog';
import SpecificatiesScreen from './screens/SpecificatiesScreen';
import AdviesScreen from './screens/AdviesScreen';
import ZakelijkDoelScreen from './screens/ZakelijkDoelScreen';
import ZakelijkOpslagScreen from './screens/ZakelijkOpslagScreen';
import NoodstroomVraagScreen from './screens/NoodstroomVraagScreen';
import ZakelijkAdviesScreen from './screens/ZakelijkAdviesScreen';
import ZakelijkNoodstroomScreen from './screens/ZakelijkNoodstroomScreen';
import NoodstroomGegevensScreen from './screens/NoodstroomGegevensScreen';
import EnergiehandelVraagScreen from './screens/EnergiehandelVraagScreen';
import OverzichtZakelijkAdviesScreen from './screens/OverzichtZakelijkAdviesScreen';
import PeakShavingScreen from './screens/PeakShavingScreen';
import PeakNoodstroomVraagScreen from './screens/PeakNoodstroomVraagScreen';
import PeakEnergieHandelVraagScreen from './screens/PeakEnergieHandelVraagScreen';
import ZakelijkAdviesPeakScreen from './screens/ZakelijkAdviesPeakScreen';
import Netcongestie from './screens/Netcongestie';
import NetcongestieNoodstroomVraag from './screens/NetcongestieNoodstroomVraag';
import NetcongestieEnergiehandelVraag from './screens/NetcongestieEnergiehandelVraag';
import ZakelijkAdviesNetcongestie from './screens/ZakelijkAdviesNetcongestie';
import Noodstroomvoorziening from './screens/Noodstroomvoorziening';
import NoodstroomEnergiehandelVraagScreen from './screens/NoodstroomEnergiehandelVraagScreen';
import ZakelijkAdviesNoodstroom from './screens/ZakelijkAdviesNoodstroom';
import LoadShifting from './screens/LoadShifting';
import LoadShiftingNoodstroomVraagScreen from './screens/LoadShiftingNoodstroomVraagScreen';
import LoadShiftingEnergiehandelVraagScreen from './screens/LoadShiftingEnergiehandelVraagScreen';
import ZakelijkAdviesLoadShiftingScreen from './screens/ZakelijkAdviesLoadShiftingScreen';
import EnergieHandel from './screens/EnergieHandel';
import HandelNoodstroomVraagScreen from './screens/HandelNoodstroomVraagScreen';
import ZakelijkAdviesHandelScreen from './screens/ZakelijkAdviesHandelScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Stap 1" component={Step1Screen} />
        <Stack.Screen name="Particulier" component={ParticulierScreen} />
<Stack.Screen name="Fase 1" component={Fase1Screen} />
<Stack.Screen name="Fase 3" component={Fase3ZekeringScreen} />
<Stack.Screen name="Persoonsgegevens" component={PersoonsgegevensScreen} />
<Stack.Screen name="Advies 5 kWh" component={Advies5kWhScreen} />
<Stack.Screen name="5 kWh Specificaties" component={Specificaties5kWhScreen} />
<Stack.Screen name="Advies 10 kWh Laag" component={Advies10Laag} />
<Stack.Screen name="Advies 7.5 kWh Hoog" component={Advies7_5Hoog} />
<Stack.Screen name="Advies 10 kWh Hoog" component={Advies10Hoog} />
<Stack.Screen name="Advies 12.5 kWh Hoog" component={Advies12_5Hoog} />
<Stack.Screen name="Advies 15 kWh Hoog" component={Advies15Hoog} />
<Stack.Screen name="Advies 17.5 kWh Hoog" component={Advies17_5Hoog} />
<Stack.Screen name="Advies 20 kWh Hoog" component={Advies20Hoog} />
<Stack.Screen name="Specificaties" component={SpecificatiesScreen} />
<Stack.Screen name="Advies" component={AdviesScreen} />
<Stack.Screen name="ZakelijkDoel" component={ZakelijkDoelScreen} />
<Stack.Screen name="ZakelijkOpslag" component={ZakelijkOpslagScreen} />
<Stack.Screen name="NoodstroomVraag" component={NoodstroomVraagScreen} />
<Stack.Screen name="ZakelijkAdvies" component={ZakelijkAdviesScreen} />
<Stack.Screen name="ZakelijkNoodstroom" component={ZakelijkNoodstroomScreen} />
<Stack.Screen name="NoodstroomGegevens" component={NoodstroomGegevensScreen} />
<Stack.Screen name="EnergiehandelVraag" component={EnergiehandelVraagScreen} />
<Stack.Screen name="OverzichtZakelijkAdvies" component={OverzichtZakelijkAdviesScreen} />
<Stack.Screen name="PeakShaving" component={PeakShavingScreen} />
<Stack.Screen name="PeakNoodstroomVraag" component={PeakNoodstroomVraagScreen} />
<Stack.Screen name="PeakEnergieHandelVraag" component={PeakEnergieHandelVraagScreen} />
<Stack.Screen name="ZakelijkAdviesPeak" component={ZakelijkAdviesPeakScreen} />
<Stack.Screen name="Netcongestie" component={Netcongestie} />
<Stack.Screen name="NetcongestieNoodstroomVraag" component={NetcongestieNoodstroomVraag} />
<Stack.Screen name="NetcongestieEnergiehandelVraag" component={NetcongestieEnergiehandelVraag} />
<Stack.Screen name="ZakelijkAdviesNetcongestie" component={ZakelijkAdviesNetcongestie} />
<Stack.Screen name="Noodstroomvoorziening" component={Noodstroomvoorziening} />
<Stack.Screen name="NoodstroomEnergiehandelVraag" component={NoodstroomEnergiehandelVraagScreen} />
<Stack.Screen name="ZakelijkAdviesNoodstroom" component={ZakelijkAdviesNoodstroom} />
<Stack.Screen name="LoadShifting" component={LoadShifting} />
<Stack.Screen name="LoadShiftingNoodstroomVraag" component={LoadShiftingNoodstroomVraagScreen} />
<Stack.Screen name="LoadShiftingEnergiehandelVraag" component={LoadShiftingEnergiehandelVraagScreen} />
<Stack.Screen name="ZakelijkAdviesLoadShifting" component={ZakelijkAdviesLoadShiftingScreen} />
<Stack.Screen name="EnergieHandel" component={EnergieHandel} />
<Stack.Screen name="HandelNoodstroomVraag" component={HandelNoodstroomVraagScreen} />
<Stack.Screen name="ZakelijkAdviesHandel" component={ZakelijkAdviesHandelScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
