const admin = require('firebase-admin');

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
admin.initializeApp()

exports.db = firebase.firestore();
exports.auth = firebase.auth();
exports.adminAuth = admin.auth();

// or
// module.exports.db = firebase.firestore();
// module.exports.auth = firebase.auth();
// modele.exports.adminAuth = admin.auth();

// or module.exports = {db,auth,adminAuth}

/// my worng
// export const db = firebase.firestore();