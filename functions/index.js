const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

const express = require('express');
const app = express();


app.get('/create',(req,res)=>{
    db.collection('myData')
      .add({
          name: 'siam',
          age: 14
      })
      .then(response=>{
        res.send("successfully added")
      })
      .catch( err=>{
          console.log(err)
      })
});
app.get('/mydata',(req,res)=>{
    db.collection('myData')
       .get()
      .then(response=>{
        var data=response.docs.map(doc=>{
            return {
                msg: 'successfull',
                count: response.docs.length,
                name: doc.data().name,
                age: doc.data().age
            }
        });
        res.status(200).json(data)
      })
      .catch( err=>{
        res.status(500).json({
            error: err
        })
      })
});

exports.api = functions.https.onRequest(app);