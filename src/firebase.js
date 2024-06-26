// firebase.js
const admin = require('firebase-admin');
const serviceAccountKey = require('./firebaseServiceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    storageBucket: "fanas-aa7ea.appspot.com"
});

const{getStorage,getDownloadURL}=require("firebase-admin/storage")

const storage = getStorage();

module.exports = { storage, getDownloadURL };
