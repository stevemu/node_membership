let chai = require('chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
require('jasmine-co').install();

let MongoWrapper = require('./index');
let MongoClient = require('mongodb').MongoClient;

let User = require('../models/User');
let Helpers = require('../../../../testHelpers/helpers');

describe('Mongo Wrapper', function () {


  describe('Save User Again overwrites previous one', function () {

    let mongoWrapper;
    let helpers;
    let db;
    let result;

    beforeAll(async function (done) {
      helpers = new Helpers();
      db = await helpers.connectToDb();
      await db.collection('users').remove({});
      mongoWrapper = new MongoWrapper(db);
      let user = new User({
        username: "a@a.com",
        hashedPassword: "a"
      });
      await mongoWrapper.saveUser(user);
      let previousUser = await db.collection('users').findOne({username: 'a@a.com'});
      const previousModel = new User(previousUser);
      previousModel.hashedPassword = "bbb";
      result = await mongoWrapper.saveUser(previousModel);
      done();
    });

    afterAll(async function(done) {
      await helpers.closeDb(db);
      done();
    });

    test('should have updated value', async (done) => {
      let r = await db.collection("users").findOne({username: 'a@a.com'});
      expect(r.hashedPassword).toEqual('bbb');
      done();

    });

    test('should return true if operation is successful', () => {
      expect(result).toEqual(true);
    });

    test('throw an error if username is present when saveUser', async (done) => {
      try {
        await mongoWrapper.saveUser({});
      } catch (err) {
        done();
      }
    });

  });

  describe('Find User', function () {

    let mongoWrapper;
    let helpers;
    let db;

    beforeAll(async function (done) {
      helpers = new Helpers();
      db = await helpers.connectToDb();
      await db.collection('users').remove({});
      mongoWrapper = new MongoWrapper(db);
      let user = new User({
        username: "a@a.com",
        hashedPassword: "a"
      });
      await mongoWrapper.saveUser(user);
      done();
    });

    afterAll(async function(done) {
      await helpers.closeDb(db);
      done();
    });

    test('should save user to DBWrapper', async function(done) {
      let result = await db.collection('users').findOne({username: 'a@a.com'});
      expect(result.username).toEqual('a@a.com');
      done();
    });

    it('should find user with username in DBWrapper', async function (done) {
      let result = await mongoWrapper.findUser({
        username: "a@a.com"
      });
      expect(result.username).toEqual('a@a.com');
      done();
    });

    it('should throw an error if username is not present when finding a user', async function (done) {
      try {
        let result = await mongoWrapper.findUser({});
      } catch (err) {
        done();
      }

    });

    it('should return null if user is not present in DBWrapper', async function (done) {
      let result = await mongoWrapper.findUser(({username: "b@b.com"}));
      expect(result).toBeNull();
      done();
    });

  });




});
