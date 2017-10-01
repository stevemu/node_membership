let chai = require('chai');
let should = chai.should();
// let exepct = chai.expect;
// let expect = require('expect');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

let Registration = require('./Registration');
let Authentication = require('./Authentication');
let Helpers = require('../../../../testHelpers/helpers');

describe('Authentication', function () {

  let db;
  let registration;
  let authentication;
  let helpers;

  beforeAll(async function (done) {
    helpers = new Helpers();
    db = await helpers.connectToDb();
    registration = new Registration(db);
    authentication = new Authentication(db, "abc");
    done();
  });

  afterAll(async function (done) {
    await helpers.closeDb(db);
    done();
  });


  describe('a valid login', function () {

    let authResult;

    beforeAll(async function (done) {
      await db.collection('users').remove({});
      // yield DBWrapper.collection('users').insertOne({name: 'qi3'});
      await registration.applyMembership({
        username: "a@b.com",
        password: "a",
        confirm: "a"
      });
      authResult = await authentication.authenticate({
        username: "a@b.com",
        password: "a"
      });
      done();
    });

    test('should return a token', () => {
      expect(authResult.token).toBeDefined();
    });

    test('should return userId', () => {
      expect(authResult.userId).toBeDefined();
    });

  });


  describe('emtpy credentials', function () {
    let authResult;

    beforeAll(async function (done) {
      await db.collection('users').remove({});
      await registration.applyMembership({
        username: "a@b.com",
        password: "a",
        confirm: "a"
      });

      done();
    });

    // more specs
    it('should return false', async () => {

      authResult = await authentication.authenticate({
        username: '',
        password: ''
      });

      authResult.success.should.be.false;
      authResult.message.should.equal("username or password is empty");
    });

  });


  describe('wrong password', function () {
    let authResult;

    beforeAll(async function (done) {
      await db.collection('users').remove({});
      // yield DBWrapper.collection('users').insertOne({name: 'qi3'});
      await registration.applyMembership({
        username: "a@b.com",
        password: "a",
        confirm: "a"
      });
      authResult = await authentication.authenticate({
        username: 'a@b.com',
        password: 'bbb'
      });
      done();
    });

    // more specs
    it('should return false', function () {
      authResult.success.should.be.false;
    });

    it('should have correct error message', function () {
      authResult.message.should.equal("wrong password");
    });

  });


  describe('username not found', function () {
    let authResult;

    beforeAll(async function (done) {
      await db.collection('users').remove({});
      authResult = await authentication.authenticate({
        username: 'b@b.com',
        password: 'bbb'
      });
      done();
    });


    it('should return false', function () {
      authResult.success.should.be.false;
    });

    it('should return correct error message', function () {
      authResult.message.should.equal("username not found");
    });


  });





});
