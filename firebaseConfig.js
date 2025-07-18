// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "JOUW_API_KEY",
  authDomain: "jouwproject.firebaseapp.com",
  projectId: "jouwproject-id",
  storageBucket: "jouwproject.appspot.com",
  messagingSenderId: "jouw-id",
  appId: "jouw-app-id",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
