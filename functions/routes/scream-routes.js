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
    var newScream = {
        body,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl,
        createdAt: new Date().toISOString(),
        commentCount: 0,
        likeCount: 0
    }

    db.collection('screams')
    .add(newScream)
    .then(doc=>{
       newScream.screamId = doc.id;
       res.status(200).json(newScream)
    })
    .catch( err=>{
          res.status(500).json({
            Error: err
          })
    })
}
// delete scream -- post
exports.deleteScream = (req,res,next)=>{
    const id = req.params.screamId;
    console.log(id)
    const likesDocument = db.collection('likes').where('userHandle','==',req.user.handle)
                           .where('screamId','==',id).get()
    const commentsDocument = db.collection('comments').where('screamId','==',id).get();
    const scream = db.collection('screams').doc(id).get()

    scream.then((doc)=>{
      if(!doc.exists){

        console.log(doc.exists,'=====================')
        return res.status(500).json({msg: 'scream not found'})
      }
      if(doc.data().userHandle !== req.user.handle){
        return res.status(400).json({msg: 'unauthorized'})
      }else{
        db.collection('screams').doc(id).delete();
      }
       // res.status(200).json({msg: 'successfully deleted'})
    })
    .then(()=>{
       return likesDocument.then(data=>{
        data.docs.forEach(doc=>{
          let docId = doc.id;
          db.collection('likes').doc(docId).delete();
        })
      })
    })
    .then(()=>{
      return commentsDocument.then(data=>{
        data.docs.forEach(doc=>{
          let docId = doc.id;
          db.collection('comments').doc(docId).delete();
        })
      })
    })
    .then(()=>{
            return res.status(200).json({msg: 'successfully deleted'})
    })
    .catch(err=>{
          return res.status(500).json({err: 'error '})
    })

}

exports.getScream = (req,res,next)=>{
  var screamData = {}
  let id = req.params.screamId;
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
      screamData.comments.push(doc.data())
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
    if(!doc.exists) 
      return res.status(404).json({error: 'scream not found'})
    return doc.ref.update({commentCount: doc.data().commentCount +1})
  })
  .then(()=>{
      return db.collection('comments').add(newComment);
  })
  .then(()=>{
      res.status(200).json(newComment)
  })
  .catch(err=>{
      res.status(500).json({err: 'somthing went worng'})
  })
}

// like scream
exports.likeScream = (req,res,next) =>{
  const id = req.params.screamId;
  // not understand
  const likeDocument = db.collection('likes').where('userHandle','==',req.user.handle)
                                             .where('screamId','==',id).limit(1)

  const screamDocument = db.doc('/screams/'+id);
  let screamData;

  screamDocument.get()
  .then(doc=>{
    if(doc.exists){
      screamData = doc.data();
      screamData.screamId = doc.id;
      return likeDocument.get();
    }else{
      return res.status(404).json({error: 'scream not found'})
    }
  })
  .then(data=>{
    // not understand
    // console.log()
    data.docs.forEach(doc=>{
      console.log(doc.data())
    })
    if(data.empty){
      return db.collection('likes').add({
        screamId: id,
        userHandle: req.user.handle
      }).then(()=>{
        screamData.likeCount++;
        return screamDocument.update({likeCount: screamData.likeCount})
      })
      .then(()=>{
        return res.status(200).json(screamData)
      })
    }else{
       return res.status(400).json({error: 'Scream already liked'})
    }
  })
  .catch(err=>{
    return res.status(500).json({err: err})
  })
}


exports.unlike = (req,res,next)=>{
  // const id = req.params.screamId;
  const likeDocument = db.collection('likes')
  .where('userHandle','==',req.user.handle)
  .where('screamId','==',req.params.screamId);
  
  const screamDocument = db.doc('/screams/'+req.params.screamId);
  let screamData;
  screamDocument.get()
  .then(doc=>{
    if(doc.exists){
      screamData = doc.data();
      screamData.screamId = doc.id;
      return likeDocument.get();
    }
  })
  .then(data=>{
    if(data.empty){
      return res.status(400).json({error: 'Scream not liked'})
    }else{
        return db.doc(`/likes/${data.docs[0].id}`).delete()
        .then(()=>{
          screamData.likeCount--;
          return screamDocument.update({likeCount: screamData.likeCount})
        })
        .then(()=>{
          return res.status(200).json(screamData)
        })
    }
  })
  .catch(err=>{
    return res.status(500).json({err: err})
  })
}