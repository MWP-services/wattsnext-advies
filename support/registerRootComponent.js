
import { registerRootComponent } from "expo";
import App from "../App";
registerRootComponent(App);


const ReactNative = require('react-native');
const { Platform } = ReactNative;


const { AppRegistry, Platform } = require('react-native');



import appConfig from '../app.json';

// Determine the primary app name from appConfig
const primaryAppName =











  (appConfig && typeof appConfig === 'object' && appConfig.expo?.name) ||
  appConfig?.name ||
  'main';



  const APP_REGISTRATION_NAMES = Array.from(
  new Set(['main', primaryAppName].filter(Boolean))
);

function registerRootComponent(Component) {



  APP_REGISTRATION_NAMES.forEach((name) => {
    AppRegistry.registerComponent(name, () => Component);

  });

  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const rootTag =
      document.getElementById('root') ||
      document.getElementById('main') ||

      document.getElementById(primaryAppName);



    if (rootTag) {
      AppRegistry.runApplication(APP_REGISTRATION_NAMES[0], {
      
        rootTag,
      });
    }
  }
}

export default registerRootComponent;
module.exports = registerRootComponent;
module.exports.default = registerRootComponent;


