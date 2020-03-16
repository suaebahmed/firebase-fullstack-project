const { auth, config,db } = require('../util/config')
const { validateSignupData ,validateSigninData } = require('../util/validate')
const { admin } = require('../util/admin')


exports.signupRoute = (req,res,next)=>{
    let uid;
    let token;
    var {email,password,handle} = req.body;
    
    const { valid, errors } = validateSignupData(req.body)
    if(!valid){
        return res.status(400).json(errors)
    }

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
      const userCredentials = { 
        userId: uid,
        email: email,
        handle: handle,
        imageUrl : `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/no-image.png?alt=media`,
        createdAt: new Date().toISOString()
      };
      return db.doc(`/users/${handle}`).set(userCredentials)
    })
    .then(()=>{
      return res.status(201).json({token})
    })
    .catch(err=>{
      if(err.code === 'auth/email-already-in-use'){
        return res.status(500).json({
          msg: 'your email already exits'
        })
      } else{
        res.status(500).json({
        msg: err.message,
        errCode: err.code,
        err: err
      })
      }
    });
}

exports.signinRoute = (req,res,next)=>{
    const {email,password} = req.body;

    const { valid, errors } = validateSigninData(req.body)
    if(!valid){
        return res.status(400).json(errors)
    }
        auth.signInWithEmailAndPassword(email,password)
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
        return db.doc(`/users/user01`).update({ imageUrl });
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