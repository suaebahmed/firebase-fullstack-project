const functions = require('firebase-functions');
const { db } = require('./util/config')
const { dbAdmin } = require('./util/admin')

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
     commentOnScream,
     likeScream,
     unlike,
     deleteScream
    } = require('./routes/scream-routes')
const { FBAuth } = require('./util/FBauth')

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,x-auth-token, authorization ,Content-Type, Accept');
    res.header('Access-Control-Allow-Methods','GET,HEAD,POST,DELETE')
    next();
  });
  
// user route
app.post('/signup',signupRoute)
app.post('/signin',signinRoute)
app.post('/user/image',FBAuth ,uploadImage);
app.post('/user/details',FBAuth ,addUserDetails);
app.get('/user',FBAuth ,getAuthenticatedUser);


// post route
app.post('/posts', FBAuth , createAScream);
app.get('/posts', FBAuth ,getAllScreams);
// #10
app.get('/posts/:postId',FBAuth,getScream);
// app.delete('/posts/:postId', FBAuth ,deleteScream);
app.post('/posts/:postId/comment',FBAuth,commentOnScream);
//#11
app.get('/posts/:postId/like',FBAuth,likeScream)
app.get('/posts/:postId/unlike',FBAuth,unlike)
app.delete('/posts/:postId', FBAuth ,deleteScream);

exports.api = functions.https.onRequest(app);

// var notifications = [
//     {
//       recipient: 'user',
//       sender: 'john',
//       read: 'true | false',
//       screamId: 'kdjsfgdksuufhgkdsufky',
//       type: 'like | comment',
//       createdAt: '2019-03-15T10:59:52.798Z'
//     }
//   ]
// // ------------
// exports.createNotificationOnLikes = functions.region('us-central1').firestore.document(`likes/{id}`)
//     .onCreate((snapshot)=>{
//         dbAdmin.doc(`/screams/${snapshot.data().screamId}`)
//             .get()
//             .then(doc=>{
//                 if(doc.exists){
//                     return dbAdmin.doc(`/notifications/${snapshot.id}`).set({
//                         createdAt: new Date().toISOString(),
//                         recipient: doc.data().userHandle,
//                         sender: snapshot.data().userHandle,
//                         type: 'like',
//                         read: false,
//                         screamId: doc.id
//                     })
//                 }
//             })
//             .then(()=>{
//                 return;
//             })
//             .catch(err=>{
//                 console.log(err);
//                 return;
//             })
//     })

// exports.deleteNotificationOnUnlike = functions.region('us-central1')
// .firestore.document(`likes/{id}`)
// .onDelete((snapshot)=>{
//     db.doc(`/notifications/${snapshot.id}`)
//       .delete()
//       .then(()=>{
//         return;
//       })
//       .catch(err=>{
//         console.log(err);
//         return;
//       })
// })
// exports.createNotificationOnComments = functions.region('us-central1')
// .firestore.document(`comments/{id}`)
// .onCreate((snapshot)=>{
//     db.doc(`/screams/${snapshot.data().screamId}`)
//         .get()
//         .then(doc=>{
//             if(doc.exists){
//                 return db.doc(`/notifications/${snapshot.id}`).set({
//                     createdAt: new Date().toISOString(),
//                     recipient: doc.data().userHandle,
//                     sender: snapshot.data().userHandle,
//                     type: 'comment',
//                     read: false,
//                     screamId: doc.id
//                 })
//             }
//         })
//         .then(()=>{
//             return;
//         })
//         .catch(err=>{
//             console.log(err);
//             return;
//         })
// })

// //  delete post /sreams ---------- #13 ---------------

// exports.onScreamDelete = functions.region('us-central1')
// .firestore
// .document('/screams/{screamId}')
// .onDelete((snapshot,context)=>{
//     const screamId = context.params.screamId;
//     const batch = db.batch();


//         return db.collection('comments').where('screamId','==',screamId).get()
//     .then(data=>{
//         data.forEach(doc=>{
//             batch.delete(db.doc(`/comments/${doc.id}`))
//         })
//         return db.collection('likes').where('screamId','==',screamId);
//     })
//     .then(data=>{
//         data.forEach(doc=>{
//             batch.delete(db.doc(`/likes/${doc.id}`))
//         })
//         return db.collection('notifications').where('screamId','==',screamId);
//     })
//     .then(data=>{
//         data.forEach(doc=>{
//             batch.delete(db.doc(`/notifications/${doc.id}`))
//         })
//         return batch.commit();
//     })
// })
