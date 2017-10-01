var bc = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");

let User = require('../models/User');
let DBWrapper = require('../DBWrapper/index');

let Authentication = function (db, jwt_secret) {
  let dbWrapper = new DBWrapper(db);

  let validateCredentials = (creds) => {
    if (creds.username && creds.password) {
      return true;
    } else {
      throw "username or password is empty";
    }
  };

  let findUser = async function (creds) {
    // let result = await db.collection('users').findOne({email: creds.email});
    let result = await dbWrapper.findUser({username: creds.username});
    if (result) {
      let user = new User(result);
      return user;
    } else {
      throw "username not found";
    }
  };

  let comparePassword = async function (password, hashedPassword) {
    if (bc.compareSync(password, hashedPassword)) {
      return true;
    } else {
      throw "wrong password";
    }
  };

  let generateToken = (user) => {
    const payload = {
      sub: user._id
    };
    const secret = jwt_secret;
    const token = jwt.sign(payload, secret);
    return token;
  };

  // cannot throw in async function, has to return something
  this.authenticate = async function (creds) {

    try {
      validateCredentials(creds);
      let user = await findUser(creds);
      await comparePassword(creds.password, user.hashedPassword);
      const token = generateToken(user);

      return {
        token: token,
        userId: user._id
      };
    } catch (err) {
      // console.log('in here');
      return {
        success: false,
        message: err
      };

    }

  };



  return this;
};

module.exports = Authentication;
