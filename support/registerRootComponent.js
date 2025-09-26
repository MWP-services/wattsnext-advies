
const ReactNative = require('react-native');
const { Platform } = ReactNative;


const { AppRegistry, Platform } = require('react-native');


import { AppRegistry, Platform } from 'react-native';

// Metro and Node sometimes evaluate this helper in contexts where static JSON
// imports are not supported. Use require so the configuration resolves in both
// environments.
// eslint-disable-next-line global-require
const appConfig = require('../app.json');

const primaryAppName =






import { AppRegistry, Platform } from 'react-native';
import appConfig from '../app.json';

const primaryAppName =


import appConfig from '../app.json';

const appName =




  (appConfig && typeof appConfig === 'object' && appConfig.expo?.name) ||
  appConfig?.name ||
  'main';



const APP_REGISTRATION_NAMES = Array.from(
  new Set(['main', primaryAppName].filter(Boolean))
);

function registerRootComponent(Component) {

  APP_REGISTRATION_NAMES.forEach((name) => {
    ReactNative.AppRegistry.registerComponent(name, () => Component);



const APP_REGISTRATION_NAMES = Array.from(
  new Set(['main', primaryAppName].filter(Boolean))

const APP_REGISTRATION_NAMES = Array.from(
  new Set(['main', primaryAppName].filter(Boolean))

import { name as appName } from '../app.json';



const APP_REGISTRATION_NAMES = Array.from(
  new Set(['main', appName].filter(Boolean))

);

export default function registerRootComponent(Component) {

  APP_REGISTRATION_NAMES.forEach((name) => {
    AppRegistry.registerComponent(name, () => Component);

  });

  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const rootTag =
      document.getElementById('root') ||
      document.getElementById('main') ||

      document.getElementById(primaryAppName);

    if (rootTag) {
      ReactNative.AppRegistry.runApplication(APP_REGISTRATION_NAMES[0], {


      document.getElementById(primaryAppName);



      document.getElementById(primaryAppName);



      document.getElementById(primaryAppName);

      document.getElementById(appName);




    if (rootTag) {
      AppRegistry.runApplication(APP_REGISTRATION_NAMES[0], {

        rootTag,
      });
    }
  }
}


module.exports = registerRootComponent;
module.exports.default = registerRootComponent;


module.exports = registerRootComponent;
module.exports.default = registerRootComponent;


