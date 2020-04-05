// const admin = require('firebase-admin');
const firebase = require('firebase');

var config = {
  apiKey: "AIzaSyBPCpnmKkmM2MXUxJdSUCi5lgx0Xqrwlr0",
  authDomain: "fir-funtiontutorial.firebaseapp.com",
  databaseURL: "https://fir-funtiontutorial.firebaseio.com",
  projectId: "fir-funtiontutorial",
  storageBucket: "fir-funtiontutorial.appspot.com",
  messagingSenderId: "330606148555",
  appId: "1:330606148555:web:9bfe1090760fbb9fb8d44e",
  measurementId: "G-5JCPMJXQ38"
};

firebase.initializeApp(config);
// admin.initializeApp()
// exports.adminAuth = admin.auth();
// exports.admin = admin;
exports.db = firebase.firestore();
exports.auth = firebase.auth();
exports.database = firebase.database();
exports.config = config;

