// firebaseConfig.js
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore as getFirestoreFull,
} from 'firebase/firestore';
import { getFirestore as getFirestoreLite } from 'firebase/firestore/lite';
import { getStorage } from 'firebase/storage';

// ---- CONFIG ----
const firebaseConfig = {
  apiKey: 'AIzaSyDKyDdlzMzyYR38XR8iukaQHDcyKq-20BQ',
  authDomain: 'wattsnext-auth.firebaseapp.com',
  projectId: 'wattsnext-auth',
  storageBucket: 'wattsnext-auth.appspot.com',
  messagingSenderId: '31058911655',
  appId: '1:31058911655:web:4cdb7a4319f53790409682',
  measurementId: 'G-CV0MS0XQ27',
};

// ---- GLOBAL SINGLETON (voorkomt dubbele module instanties / hot reload issues) ----
const G = globalThis;

// Bewaar alles onder één sleutel op globalThis
if (!G.__FIREBASE_SINGLETON__) {
  // 1) App
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

  // 2) Auth
  // In RN moet je initializeAuth EXACT 1x aanroepen met persistence.
  if (Platform.OS !== 'web') {
    try {
      initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch {
      // already initialized (hot reload) -> OK
    }
  }
  const auth = getAuth(app);

  // 3) Firestore (full) met long polling voor RN/Expo
  let db;
  try {
    db = initializeFirestore(app, { experimentalForceLongPolling: true });
  } catch {
    db = getFirestoreFull(app);
  }

  // 4) Firestore Lite + Storage
  const dbLite = getFirestoreLite(app);
  const storage = getStorage(app);

  G.__FIREBASE_SINGLETON__ = { app, auth, db, dbLite, storage };
}

// ---- Exports (altijd uit global singleton halen) ----
export const app = G.__FIREBASE_SINGLETON__.app;
export const auth = G.__FIREBASE_SINGLETON__.auth;
export const db = G.__FIREBASE_SINGLETON__.db;
export const dbLite = G.__FIREBASE_SINGLETON__.dbLite;
export const storage = G.__FIREBASE_SINGLETON__.storage;
export default app;
