import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDKyDdlzMzyYR38XR8iukaQHDcyKq-20BQ",
  authDomain: "wattsnext-auth.firebaseapp.com",
  projectId: "wattsnext-auth",
  storageBucket: "wattsnext-auth.appspot.com",
  messagingSenderId: "31058911655",
  appId: "1:31058911655:web:4cdb7a4319f53790409682",
  measurementId: "G-CV0MS0XQ27"
};

const app = initializeApp(firebaseConfig);

let auth;

// ✅ Kies auth-methode afhankelijk van platform
if (typeof window !== 'undefined') {
  // Web: gebruik standaard getAuth()
  auth = getAuth(app);
} else {
  // React Native: gebruik AsyncStorage persistentie
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

const db = getFirestore(app);

export { auth, db };
