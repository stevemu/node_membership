var bc = require("bcrypt-nodejs");

let Application = require('../models/Application');
let User = require('../models/User');
let DBWrapper = require('../DBWrapper/index');

let Registration = function (db) {
  let dbWrapper = new DBWrapper(db);

  this.applyMembership = async function (args) {

    let app = Application(args);
    let result;

    try {
      app = await validateInputs(app);
      app = await checkUserExists(app);
      app = await createUser(app);
      result = {success: true};

    } catch (err) {
      result = {success: false};
      result.message = app.message;
    }

    return result;

  };

  let validateInputs = (app) => {
    return new Promise((resolve, reject) => {

      if (!app.username || !app.password) {
        app.setInvalid('no username or password');
        reject(app);
      } else if (app.password !== app.confirm) {
        app.setInvalid("password does not match");
        reject(app);
      }
      else {
        app.setValid();
        resolve(app);
      }

    });
  };

  let checkUserExists = async function (app) {

    let result = await dbWrapper.findUser({username: app.username});
    if (result == null) {
      return app;
    } else if (result.username) {
      app.setInvalid("username exists");
      throw app;
    } else {
      app.setInvalid("unknown error");
      throw app;
    }

  };

  let createUser = async function (app) {

    let user = new User(app);

    user.hashedPassword = bc.hashSync(app.password);
    user.status = 'approved';
    // await db.collection('users').insertOne(user);
    await dbWrapper.saveUser(user);
    return app;
  };


  return this;
};


module.exports = Registration;
