const { auth, config,db ,database} = require('../util/config')
const { validateSignupData ,validateSigninData } = require('../util/validate')
const { admin } = require('../util/admin')


exports.signupRoute = (req,res,next)=>{
    let userCredentials
    let uid;
    let token;
    var {email,password} = req.body;
    
    // const { valid, errors } = validateSignupData(req.body)
    // if(!valid){
    //     return res.status(400).json(errors)
    // }
    console.log(req.body)
    // genarate random key
    const handle = database.ref().push().key;

    db.doc(`/users/${handle}`).get()
    .then(doc=>{
        if(doc.exists){
            res.status(400).json({
            msg: 'the email/handle already exits'
          })
        }else{
          return auth.createUserWithEmailAndPassword(email,password)
        }
    })
    .then(data=>{
      uid = data.user.uid;
      return data.user.getIdToken();
    })
    .then(istoken=>{
      token = istoken // this is promise base we should call indivitual
       userCredentials = { 
        userId: uid,
        email: email,
        handle: handle,
        imageUrl : `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/no-image.png?alt=media`,
        createdAt: new Date().toISOString()
      };
      return db.doc(`/users/${handle}`).set(userCredentials)
    })
    .then(()=>{
      
      return res.status(200).json({token,user: userCredentials})
    })
    .catch(err=>{
      if(err.code === 'auth/email-already-in-use'){
        return res.status(500).json({
          msg: 'your email already exits'
        })
      } 
      // else{
      //   res.status(500).json({
      //   msg: err.message,
      //   errCode: err.code,
      //   err: err
      // })
      // }
    });
}

exports.signinRoute = (req,res,next)=>{
        const {email,password} = req.body;
        let token;
        let uid;
        let userInfo;
        // const { valid, errors } = validateSigninData(req.body)
        // if(!valid){
        //     return res.status(400).json(errors)
        // }
        auth.signInWithEmailAndPassword(email,password)
        .then(data=>{   // not return user info but does onAuthStateChanged(user=>{})
          uid = data.user.uid
          return data.user.getIdToken()
        })
        .then(isToken=>{
          token = isToken;
          return db.collection(`users`).where('userId','==',uid).limit(1).get()
        })
        .then(doc=>{
          doc.docs.forEach(doc1=>{
            userInfo = doc1.data()
          })
          return res.status(200).json({token,user: userInfo})
        })
        .catch(err=>{
          // return res.status(500).json({
          //   msg: 'user signin fail',
          //   error: err
          // })
          if(err.code === 'auth/email-already-in-use'){
            return res.status(500).json({
              msg: 'your email already exits'
            })
          } 
        })
}

exports.uploadImage = (req, res) => {
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');
  
  const busboy = new BusBoy({ headers: req.headers });

  let imageToBeUploaded = {};
  let imageFileName;

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      return res.status(400).json({ error: 'Wrong file type submitted' });
    }
    // my.image.png => ['my', 'image', 'png']
    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    // 32756238461724837.png
    imageFileName = `${Math.round(Math.random() * 1000000000000).toString()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on('finish', () => {
    admin
      .storage()
      .bucket(config.storageBucket)  //bucket name required
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
      })
      .then(() => {
        return res.status(200).json({ message: 'image uploaded successfully' });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: 'something went wrong: '+err.code });
      });
  });
  busboy.end(req.rawBody);
};

exports.addUserDetails = (req,res)=>{
  //please set validate data
  const { bio,location,website } = req.body
  //and update
  db.doc(`/users/${req.user.handle}`).update({bio,location,website})
    .then(()=>{
      res.status(200).json({
        msg: 'user details successfully update'
      })
    })
    .catch(err=>{
      res.status(500).json({
        err: err.code
      })
    })
}

exports.getAuthenticatedUser = (req,res)=>{
  var userData = {};
  db.doc(`/users/${req.user.handle}`).get()
  .then((data)=>{
    if(data.exists){
    userData = data.data();
  //   return db.collection('likes').where('userHandle','==',req.user.handle).get()
    }
  // })
  // .then(doc=>{
  //   if(doc.exists){
  //     userData.likes = doc.data();
  //   }
    return res.status(200).json({user: userData})
  })
  .catch(err=>{
    return res.status(500).json({
      err: err.code
    })
  })
}