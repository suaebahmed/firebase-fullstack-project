const functions = require('firebase-functions');

const express = require('express');
const app = express();
app.use(express.json());

const { signupRoute,signinRoute ,uploadImage } = require('./routes/user-routes')
const { createAScream , getAllScreams  } = require('./routes/scream-routes')
const { FBAuth } = require('./util/FBauth')

// user route
app.post('/signup',signupRoute)
app.post('/signin',signinRoute)

// post route
app.post('/create', FBAuth , createAScream);
app.get('/mydata', FBAuth ,getAllScreams);
app.post('/user/image' ,uploadImage);

exports.api = functions.https.onRequest(app);