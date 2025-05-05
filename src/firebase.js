// Importa las funciones necesarias de los SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase para tu proyecto
const firebaseConfig = {
    apiKey: "AIzaSyD7mMx4F-FIr-F0qxVs8d2UxLZolNRs6FM",
    authDomain: "proyecto-final-454ee.firebaseapp.com",
    projectId: "proyecto-final-454ee",
    storageBucket: "proyecto-final-454ee.appspot.com", // corregido dominio del bucket
    messagingSenderId: "671973119647",
    appId: "1:671973119647:web:e28dc773ee23702a7374aa"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta los servicios que usarás
export const auth = getAuth(app);
export const db = getFirestore(app);
