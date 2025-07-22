import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// Jouw Firebase configuratie
const firebaseConfig = {
  apiKey: "AIzaSyDKyDdlzMzyYR38XR8iukaQHDcyKq-20BQ",
  authDomain: "wattsnext-auth.firebaseapp.com",
  projectId: "wattsnext-auth",
  storageBucket: "wattsnext-auth.appspot.com",
  messagingSenderId: "31058911655",
  appId: "1:31058911655:web:4cdb7a4319f53790409682",
  measurementId: "G-CV0MS0XQ27"
};

// Init Firebase
const app = initializeApp(firebaseConfig);

// Init Auth met persistentie via AsyncStorage (voor React Native)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Init Firestore (voor klantgegevens)
const db = getFirestore(app);

export { auth, db };
