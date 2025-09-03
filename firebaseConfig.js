// firebaseConfig.js
import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getFirestore as getFirestoreLite } from 'firebase/firestore/lite';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDKyDdlzMzyYR38XR8iukaQHDcyKq-20BQ',
  authDomain: 'wattsnext-auth.firebaseapp.com',
  projectId: 'wattsnext-auth',
  storageBucket: 'wattsnext-auth.appspot.com',
  messagingSenderId: '31058911655',
  appId: '1:31058911655:web:4cdb7a4319f53790409682',
  measurementId: 'G-CV0MS0XQ27',
};

// 1) App init
export const app = initializeApp(firebaseConfig);

// 2) Volledige Firestore (voor elders in de app, met stabiel transport in RN/Expo)
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // voorkomt WebChannel/stream errors
});

// 3) Firestore Lite (REST-only; ideaal voor snelle writes zoals registreren)
export const dbLite = getFirestoreLite(app);

// 4) Auth met juiste persistentie per platform
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}
export { auth };
