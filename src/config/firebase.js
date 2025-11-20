// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { signOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBr6HXQjKzI4Wn69T9z7Tuh0-DV0E4WCdQ",
  authDomain: "rutasapp-5414a.firebaseapp.com",
  databaseURL: "https://rutasapp-5414a-default-rtdb.firebaseio.com",
  projectId: "rutasapp-5414a",
  storageBucket: "rutasapp-5414a.firebasestorage.app",
  messagingSenderId: "799458196295",
  appId: "1:799458196295:web:27aa505201b9ddca762a62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);


// HANDLE GOOGLE LOGIN
export const handleGoogleLogin = async (setError) => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log('Google Sign-In:', result.user);
        setError('');
    } catch (err) {
        console.log(err);
        setError('Google Sign-In failed');
    }
}

// HANDLE LOGIN USING EMAIL AND PASSWORD
export const handleSubmit = async (e, setError) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in:', userCred.user);
        setError('');
    } catch (err) {
        console.log(err);
        setError('Invalid email or password');
    }
    e.target.reset();
}

export const logout = async () => {
    try {
        signOut(auth)
    } catch(err) {
        console.log(err)
    }
}

//export { auth, googleProvider, handleGoogleLogin, handleSubmit }