let chai = require('chai');
let should = chai.should();
// let expect = chai.expect;
let chaiAsPromised = require('chai-as-promised');
let sinonChai = require('sinon-chai');
chai.use(chaiAsPromised);
chai.use(sinonChai);
require('jasmine-co').install();
let sinon = require('sinon');
let MockExpressResponse = require('mock-express-response');
let run = require('express-unit');

let authCheck = require('./auth-check');

describe('Auth Check', function () {

  test('pass auth if authorization is correct', async (done) => {
    const setup = (req, res, next) => {
      req.headers.authorization = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWI0OTU0MzBlNWViOTIzOTA4ZDRkMTAiLCJpYXQiOjE1MDUwMjMzOTB9.fz6dgmYx-_ZABPUHqf6eta79wNPBtGFe89qyfH8Hj9U';
      // sinon.spy(res, 'status');
      next();
    };
    const [err, req, res] = await run(setup, authCheck);
    expect(err).toBeNull();
    done();

  });

  test('not pass auth if authorization is malformed', async (done) => {
    const setup = (req, res, next) => {
      req.headers.authorization = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX';
      sinon.spy(res, 'status');
      next();
    };
    const [err, req, res] = await run(setup, authCheck);
    expect(res.status.args[0][0]).toEqual(401);
    done();
  });

  test('not pass auth if there is no authorization in headers', async (done) => {
    const setup = (req, res, next) => {
      sinon.spy(res, 'status');
      next();
    };
    const [err, req, res] = await run(setup, authCheck);
    expect(res.status.args[0][0]).toEqual(401);
    done();
  });


});
