require("dotenv").config();
const firebase = require("firebase/app");
const admin = require('firebase-admin');

const serviceAccountKey = require('./firebaseServiceAccountKey.json');

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase SDK
const app = firebase.initializeApp(firebaseConfig);
// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    storageBucket: "fanas-aa7ea.appspot.com"
});

const{getStorage,getDownloadURL}=require("firebase-admin/storage");
const dbFirestore = admin.firestore();
//Authentication object
const { getAuth: getAuthAdmin } = require("firebase-admin/auth");
const { getAuth: getAuthClient,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updatePassword,
    signOut } = require("firebase/auth");

const storage = getStorage();

module.exports = { 
    storage, 
    getDownloadURL, 
    getAuthAdmin,
    getAuthClient,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updatePassword,
    admin,
    firebase,
    dbFirestore
};
