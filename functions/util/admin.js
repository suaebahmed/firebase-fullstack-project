const admin = require('firebase-admin');
var serviceAccount = require("C:/Users/suaeb/Downloads/fir-funtiontutorial-firebase-adminsdk-chp1g-e477236c8a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-funtiontutorial.firebaseio.com"
});
const dbAdmin = admin.firestore();
module.exports = { admin , dbAdmin};