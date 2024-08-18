// src/services/firebase.ts

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_qOdt_b74kxwbnv4rXrhcKAy18bwgSc0",
  authDomain: "wisata-app-2dce8.firebaseapp.com",
  databaseURL: "https://wisata-app-2dce8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wisata-app-2dce8",
  storageBucket: "wisata-app-2dce8.appspot.com",
  messagingSenderId: "592275780455",
  appId: "1:592275780455:web:c04b59a3cbf7e4fea5f5c2",
};

// Initialize Firebase
const firebaseSDK = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
const firestore = getFirestore(firebaseSDK);
const storage = getStorage(firebaseSDK);

export { firebaseSDK, firestore, storage };

// Function to upload image
export const uploadImage = async (file: File) => {
  try {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

// Function to check admin credentials
export const checkAdminCredentials = async (username, password) => {
  const adminsRef = collection(firestore, 'admins');
  const q = query(adminsRef, where('username', '==', username), where('password', '==', password));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return false; // No matching admin found
  }
  return true; // Matching admin found
};
