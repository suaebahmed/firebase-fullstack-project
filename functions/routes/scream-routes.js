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
exports.getScream = (req,res,next)=>{
  var screamData = {}
  let id = req.params.screamid;
  console.log(id)
  db.doc('/screams/'+id).get()
  .then(doc=>{
    screamData = doc.data();
    // get the scream related comment
    return db.collection('comments').where('screamId','==',id).get();
  })
  .then((alldoc)=>{
    screamData.comments = []
    alldoc.docs.forEach(doc=>{
      screamData.comments.push({comment: doc.data()})
    })
    return res.status(200).json({screamData})
  })
  .catch(err=>{
    res.status(500).json({err: err.code})
  })
}

exports.commentOnScream = (req,res,next)=>{
  if(req.body.body.trim() == '') return res.status(400).json({error: 'Must not be empty'})
  let id = req.params.screamId

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    screamId: id,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  }

  db.doc('/screams/'+id).get()
  .then(doc=>{
    if(!doc.exists) return res.status(404).json({error: 'scream not found'})
    return db.collection('comments').add(newComment);
  })
  .then(()=>{
    res.status(200).json(newComment)
  })
  .catch(err=>{
      res.status(500).json({err: 'somthing went worng'})
  })
}