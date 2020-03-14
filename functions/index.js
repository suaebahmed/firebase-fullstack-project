const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const app = express();
const firebase = require('firebase');
app.use(express.json());

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
admin.initializeApp();
const db = firebase.firestore();
// ------------- validation --------------------

const isEmpty = (string) =>{
  if(string.trim() == '') return true
  return false
}
const isEmail = (string) =>{
  const regEx = '/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/'
  if(string.match(regEx)) return true;
  return false;
}


app.post('/signup',(req,res,next)=>{
  let uid;
  let token;
  var {email,password,confirmPassword,handle} = req.body;
  var errors = {}

  if(isEmpty(email)){
    errors.email = 'email must not be empty';
  }else if(!isEmail(email)){
    errors.email = 'Must be a valid email address.'
  }
  if(isEmpty(password)) errors.password = 'password must not be empty';
  if(password !== confirmPassword) errors.confirmPassword = 'Password should be match'
  if(isEmpty(handle)) errors.handle = 'handle must not be empty'

  if(Object.keys(errors).length > 0){
    return res.status(400).json(errors)
  }
  // -------------  end validation ----------
  db.collection('users').doc(handle).get()
  .then(doc=>{
    if(doc.exists){
      return  res.status(400).json({
        msg: 'the email already exits'
      })
    }else{
      return firebase.auth().createUserWithEmailAndPassword(email,password)
    }
  })
  .then(data=>{
    // console.log(data.user.getIdToken())  // you cann't get the token but below
    uid = data.user.uid;
    return data.user.getIdToken();
  })
  .then(token=>{
    db.collection('users').doc(handle).set({
      userId: uid,
      email: email,
      handle: handle,
      createdAt: new Date().toISOString()
    }).catch(err=>{
      return  res.status.json({
        msg: 'error to save signup user data is firestore',
        err: err.code
      })
    })
    res.status(200).json({token})
  })
  .catch(err=>{
    if(err.code === 'auth/email-already-in-use'){
      return res.status(500).json({
        msg: 'your email already exits'
      })
    }
    console.log('this line code is executed')// because many then method ..
  })
})


app.post('/signin',(req,res,next)=>{
  const {email,password} = req.body;
  var errors = {}
  if(isEmpty(email)){
    errors.email = 'email must not be empty'
  }
  if(isEmpty(password)){
    errors.password = 'password must not be empty'
  }
  if(Object.keys(errors).length > 0){
    return res.status(400).json(errors)
  }
  firebase
      .auth().signInWithEmailAndPassword(email,password)
      .then(data=>{   // not return user info but does onAuthStateChanged(user=>{})
        return data.user.getIdToken()
      })
      .then(token=>{
        res.status(200).json({token})
      })
      .catch(err=>{
        return res.status(500).json({
          msg: 'user signin fail',
          error: err
        })
      })
})
// -----------------------------   middleware   ---------------
const FBAuth = (req,res,next)=>{
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearar ')){
    token = req.headers.authorization.split('Bearar ')[1]
  }
  if(!token){
    return  res.status(400).json({
      msg: 'no token unauthorize'
    })
  }
  admin.auth().verifyIdToken(token)
          .then(decoded=>{
            req.user = decoded; // add user data in user headers
            return db.collection('mydata')
                     .where('userId','==',req.user.uid)
                     .limit(1)
                     .get();
          })
          .then(data=>{
              req.user.handle = data.docs[0].data().handle;
            return next();
          })
          .catch(err=>{
            return res.status(500).json({
              msg: 'authorization error',
              error: err
            })
          })
}

app.post('/create', FBAuth ,(req,res)=>{
    db.collection('mydata')
      .add({
          name: req.body.name,
          age: req.body.age
      })
      .then(response=>{
        res.send("successfully added")
      })
      .catch( err=>{
            res.status(500).json({
              Error: err
            })
      })
});

app.get('/mydata', FBAuth ,(req,res)=>{
    db.collection('mydata')
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