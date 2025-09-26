import 'react-native-gesture-handler';        // verplicht voor navigation
import 'react-native-reanimated';             // nodig voor native-stack animaties
import 'react-native-url-polyfill/auto';      // hield jouw URL.host-fout tegen
import 'react-native-get-random-values';      // als je crypto/random nodig hebt

import './polyfills';
import registerRootComponent from './support/registerRootComponent';

import App from './App';

registerRootComponent(App);
