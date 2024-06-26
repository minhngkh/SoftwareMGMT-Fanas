require("dotenv").config();
const firebase = require("firebase/app");

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

firebase.initializeApp(firebaseConfig);

const admin = require('firebase-admin');
const serviceAccountKey = require('./firebaseServiceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    storageBucket: "fanas-aa7ea.appspot.com"
});

const{getStorage,getDownloadURL}=require("firebase-admin/storage");
const {
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut
} = require("firebase/auth");

const storage = getStorage();

module.exports = { 
    storage, 
    getDownloadURL, 
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    admin
};
