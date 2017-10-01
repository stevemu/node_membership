let assert = require('assert');

let MongoWrapper = function (mongoDB) {

  // can create or update an user
  this.saveUser = async function(user) {
    assert(user.username, "username is required");

    // find existing one
    let existingUser = await mongoDB.collection('users').findOne({username: user.username});

    try {
      if (existingUser) {
        // console.log('here1');
        await mongoDB.collection('users').updateOne({username: user.username}, user);
      } else {
        // user does not exist, insert it
        await mongoDB.collection('users').insertOne(user);
      }
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }

  };

  this.findUser = async function(args) {
    assert(args.username, "username is required");

    try {
      let result = mongoDB.collection('users').findOne(args);
      return result;
    } catch (err) {
      return err;
    }

  };


  return this;
};

module.exports = MongoWrapper;
