const { db } = require('./config')
const { admin } = require("./admin")

exports.FBAuth = (req,res,next)=>{
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
              return db.collection('users') // database check 
                       .where('userId','==',req.user.uid)
                       .limit(1)
                       .get();
            })
            .then(data=>{
                req.user.handle = data.docs[0].data().handle;
                req.user.imageUrl = data.docs[0].data().imageUrl
              return next();
            })
            .catch(err=>{
              return res.status(500).json({
                msg: 'authorization error',
                error: err.code
              })
            })
  }
  