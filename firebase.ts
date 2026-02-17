
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  // Use process.env.API_KEY exclusively as per environment security guidelines
  apiKey: process.env.API_KEY,
  authDomain: "wacu-8b32d.firebaseapp.com",
  projectId: "wacu-8b32d",
  storageBucket: "wacu-8b32d.firebasestorage.app",
  messagingSenderId: "974341441506",
  appId: "1:974341441506:web:97bf9dcb25307185f01bbb",
  measurementId: "G-SZQH2SK962"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth Helpers
export { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider };

// Helper for image uploads to Firebase Storage
export const uploadImage = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};
