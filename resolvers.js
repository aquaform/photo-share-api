const {GraphQLScalarType} = require("graphql")

let _id = 0;
let users = [
    { githubLogin: "mHattrup", name: "Mike Hattrup" },
    { githubLogin: "gPlake", name: "Goga Plake" },
    { githubLogin: "sSchmidt", name: "Serega Schmidt" }
  ];
  
  let photos = [
    {
      id: "1",
      name: "Dropping the Heart Chute",
      description: "The heart chute is one of my favorite chutes",
      category: "ACTION",
      githubUser: "gPlake",
      created: "3-28-1977"
    },
    {
      id: "2",
      name: "Enjoy the sunshine",
      category: "SELFIE",
      githubUser: "sSchmidt",
      created: "1-2-1985"
    },
    {
      id: "3",
      name: "Gunbarrel 25",
      description: "25 laps on gunbarrel today",
      category: "LANDSCAPE",
      githubUser: "sSchmidt",
      created: "2018-04-15T19:09:57.308Z"
    }
  ];
  
  let tags = [
    { photoID: "1", userID: "gPlake" },
    { photoID: "2", userID: "sSchmidt" },
    { photoID: "2", userID: "mHattrup" },
    { photoID: "2", userID: "gPlake" }
  ];



let resolvers = {
    Query: {
      totalPhotos: (parent, args, { db }) => db.collection('photos').eslimatedDocumentCount(),
      allPhotos: (parent, args, { db }) => db.collection('photos').find().toArray(),
      totalUsers: (parent, args, { db }) => db.collection('users').eslimatedDocumentCount(),
      allPhotos: (parent, args, { db }) => db.collection('users').find().toArray()
    },
      
    Mutation: {
      postPhoto(parent, args) {
        let newPhoto = {
          id: _id++,
          ...args.input,
          created: new Date()
        };
        photos.push(newPhoto);
        return newPhoto;
      }
    },
  
    Photo: {
      url: parent => `http://yousite.com/img/${parent.id}.jpg`,
      postedBy: parent => {
        return users.find(u => u.githubLogin === parent.githubUser);
      },
      taggedUsers: parent =>
        tags
          .filter(tag => tag.photoID === parent.id)
          .map(tag => tag.userID)
          .map(userID => users.find(u => u.githubLogin === userID))
    },
  
    User: {
      postedPhotos: parent => {
        return photos.filter(p => p.githubUser === parent.githubLogin);
      },
      inPhotos: parent =>
        tag
          .filter(tag => tag.userID === parent.id)
          .map(tag => tag.photoID)
          .map(photoID => photos.find(p => p.id === photoID))
    },
    DateTime: new GraphQLScalarType({
      name: 'DateTime',
      description: 'A valid date time value.',
      parseValue: value => new Date(value),
      serialize: value => new Date(value).toISOString(),
      parseLiteral: ast => ast.value
    })
  };

  module.exports = resolvers;