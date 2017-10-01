let chai = require('chai');
let should = chai.should();
// let exepct = chai.expect;
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let MongoClient = require('mongodb').MongoClient;
let Helpers = require('../../../testHelpers/helpers');

/* eslint-disable no-console */

let Membership = require('./index').Membership;

describe('membership', function () {
    describe('index', function () {
      it('should export', function () {
        let index = require('./index');
        should.exist(index);
      });
    });

    describe('registration', function () {
      let db;
      let membership;
      let registerResult;
      let helpers;

      beforeAll(async function(done) {
        helpers = new Helpers();
        db = await helpers.connectToDb();
        await db.collection('users').remove({});
        membership = new Membership(db);
        registerResult = await membership.register({username: "a@a.com", password: "a", confirm: "a"});
        done();
      });

      afterAll(async function (done) {
        await helpers.closeDb(db);
        done();
      });

      it('should return success', function () {
        registerResult.success.should.be.true;
      });

      it('should create records in the DBWrapper', async function (done) {
        let result = await db.collection('users').findOne({username: 'a@a.com'});
        should.exist(result);
        done();
      });

    });

    describe('Login', function () {
      let db;
      let membership;
      let helpers;

      beforeAll(async function(done) {
        helpers = new Helpers();
        db = await helpers.connectToDb();
        await db.collection('users').remove({});
        membership = new Membership(db);
        await membership.register({username: "a@a.com", password: "a", confirm: "a"});
        done();
      });

      afterAll(async function (done) {
        await helpers.closeDb(db);
        done();
      });

      it('should authenticate successfully', async function (done) {
        let result = await membership.authenticate({username:'a@a.com', password:'a'});
        result.success.should.be.true;
        done();

      });


    });
});
