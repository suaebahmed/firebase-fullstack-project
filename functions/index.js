const functions = require('firebase-functions');

const express = require('express');
const app = express();
app.use(express.json());

const { signupRoute,
    signinRoute ,
    uploadImage ,
    getAuthenticatedUser,
    addUserDetails
} = require('./routes/user-routes')
const { createAScream ,
     getAllScreams ,
     getScream ,
     commentOnScream
    } = require('./routes/scream-routes')
const { FBAuth } = require('./util/FBauth')

// user route
app.post('/signup',signupRoute)
app.post('/signin',signinRoute)
app.post('/user/image',FBAuth ,uploadImage);
app.post('/user/details',FBAuth ,addUserDetails);
app.get('/user',FBAuth ,getAuthenticatedUser);


// post route
app.post('/create', FBAuth , createAScream);
app.get('/mydata', FBAuth ,getAllScreams);
// #10
app.get('/mydata/:screamid',FBAuth,getScream);
app.post('/comment/:screamId',FBAuth,commentOnScream);

exports.api = functions.https.onRequest(app);