require("dotenv").config();
const firebase = require("firebase/app");
const admin = require("firebase-admin");

const buffer = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, "base64");
const serviceAccountKey = JSON.parse(buffer.toString("utf-8"));

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase SDK
const app = firebase.initializeApp(firebaseConfig);
// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  storageBucket: "fanas-aa7ea.appspot.com",
});

const { getStorage, getDownloadURL } = require("firebase-admin/storage");
const dbFirestore = admin.firestore();
//Authentication object
const { getAuth: getAuthAdmin } = require("firebase-admin/auth");
const {
  getAuth: getAuthClient,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  signOut,
} = require("firebase/auth");

// No state needed since we are using the client SDK in the server
getAuthClient().setPersistence("NONE");

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
  dbFirestore,
};
