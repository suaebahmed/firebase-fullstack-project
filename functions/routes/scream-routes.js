const { db } = require('../util/config')

exports.getAllScreams = (req,res,next)=>{
        db.collection('screams')
          .orderBy('createdAt','desc')
          .get()
          .then(data=>{
              let screams = []
              data.docs.forEach(doc=>{
                screams.push({
                    screamId : doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt,
                    commentCount: doc.data().commentCount,
                    likeCount: doc.data().likeCount
                })
              })
              res.status(200).json(screams)
          })
          .catch( err=>{
                res.status(500).json({
                  Error: err
                })
          })
}

exports.createAScream = (req,res,next) =>{
    const { screamId, body,userHandle,commentCount,likeCount } = req.body
    db.collection('screams')
    .add({
        body,
        userHandle,
        createdAt: new Date().toISOString(),
        commentCount,
        likeCount
    })
    .then(response=>{
      res.send("successfully added")
    })
    .catch( err=>{
          res.status(500).json({
            Error: err
          })
    })
}