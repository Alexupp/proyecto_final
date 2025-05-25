// Importa las funciones necesarias de los SDKs
import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from 'firebase/functions';

// Configuración de Firebase para tu proyecto
const firebaseConfig = {
    apiKey: "AIzaSyD7mMx4F-FIr-F0qxVs8d2UxLZolNRs6FM",
    authDomain: "proyecto-final-454ee.firebaseapp.com",
    projectId: "proyecto-final-454ee",
    storageBucket: "proyecto-final-454ee",
    messagingSenderId: "671973119647",
    appId: "1:671973119647:web:e28dc773ee23702a7374aa"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Configuración de autenticación
const auth = getAuth(app);

// Configuración del proveedor de Google
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account' // Solicita al usuario que seleccione una cuenta
});
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');

// Exporta los servicios que usarás
export {
    auth,
    googleProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult
};
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);