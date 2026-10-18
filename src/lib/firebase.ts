import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Assuming they want firestore database as well if they were using it, but they didn't provision firestore.
// Wait, the prompt for cloud SQL says we only provision Firebase Auth. 
// I will keep getFirestore since they already imported it, maybe it won't be used or maybe it will.
export const db = getFirestore(app);
