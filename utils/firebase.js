import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDkYWHxfyPfUYEKhW_RKCYzwpl61nlMsfI",
    authDomain: "syncall-23fcc.firebaseapp.com",
    projectId: "syncall-23fcc",
    storageBucket: "syncall-23fcc.firebasestorage.app",
    messagingSenderId: "182840114801",
    appId: "1:182840114801:web:334f0e3ccb6bda7db925d0",
    measurementId: "G-B4813J8N1N"
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue, set, push };
