const { auth,db } = require('../util/config')
const { validateSignupData ,validateSigninData } = require('../util/validate')

exports.signupRoute = (req,res,next)=>{
    let uid;
    let token;
    var {email,password,confirmPassword,handle} = req.body;
    
    const { valid, errors } = validateSignupData(req.body)
    if(!valid){
        return res.status(400).json(errors)
    }
    db.collection('users').doc(handle).get()
    .then(doc=>{
      if(doc.exists){
        return  res.status(400).json({
          msg: 'the email already exits'
        })
      }else{
        return auth.createUserWithEmailAndPassword(email,password)
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