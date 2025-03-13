import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
	getAuth,
	signOut,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyC4zwe8-fZAzYCp-5ygXwfvQJyyjFgAjoc",
	authDomain: "food-app-77001.firebaseapp.com",
	projectId: "food-app-77001",
	storageBucket: "food-app-77001.firebasestorage.app",
	messagingSenderId: "967433652538",
	appId: "1:967433652538:web:16855ef94c6bdc858f2803",
	measurementId: "G-JLZG846LSS",
};

initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();

export const register = (email: string, password: string) => {
	return createUserWithEmailAndPassword(auth, email, password);
};

export const login = (email: string, password: string) => {
	return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
	return signOut(auth);
};
