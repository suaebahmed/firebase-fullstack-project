let db = {
  users: [  // primary key 1
    {
      userId: 'dh23ggj5h32g543j5gf43',// primary key 2
      email: 'user@email.com',
      handle: 'user', // primary key 3
      createdAt: '2019-03-15T10:59:52.798Z',
      imageUrl: 'image/dsfsdkfghskdfgs/dgfdhfgdh', // imageUpdate
      bio: 'Hello, my name is user, nice to meet you', //updateDatails
      website: 'https://user.com',
      location: 'Lonodn, UK'
    }
  ],
  screams: [ // screamId --primary key
    {
      userHandle: 'user',
      body: 'This is a sample scream',
      createdAt: '2019-03-15T10:59:52.798Z',
      likeCount: 5,
      commentCount: 3
    }
  ],
  comments: [
      {
      body: "wellcome !",
      createdAt: "17 March 2020 at 00:00:00 UTC+6",
      screamId: "ddsdf",  //----foreign key screamId
      userHandle:  "jhjjdhj",
      }
  ],
  notifications: [
    {
      recipient: 'user',
      sender: 'john',
      read: 'true | false',
      screamId: 'kdjsfgdksuufhgkdsufky',
      type: 'like | comment',
      createdAt: '2019-03-15T10:59:52.798Z'
    }
  ]
}

// ----------Redux data-----
const userDetails = {
  credentials: {
    userId: 'N43KJ5H43KJHREW4J5H3JWMERHB', //primary key 2
    email: 'user@email.com',
    handle: 'user',  // primary key 1
    createdAt: '2019-03-15T10:59:52.798Z',
    imageUrl: 'image/dsfsdkfghskdfgs/dgfdhfgdh',
    bio: 'Hello, my name is user, nice to meet you',
    website: 'https://user.com', 
    location: 'Lonodn, UK'
  },
  likes: [
    {
      userHandle: 'user',
      screamId: 'hh7O5oWfWucVzGbHH2pa'
    },
    {
      userHandle: 'user',
      screamId: '3IOnFoQexRcofs5OhBXO'
    }
  ]
};