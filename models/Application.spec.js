let chai = require('chai');
let should = chai.should();
let expect = chai.expect;
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
require('jasmine-co').install();

let Application = require('./Application');

describe('Application', function () {

  describe('should have fields', function () {

    // more specs
    let app;

    beforeAll(() => {
      app = Application({
        username: "a@a.com",
        password: "a",
        confirm: "a"
      });
    });

    it('should have username', function () {
      app.username.should.equal('a@a.com');
    });

    it('should have password', function () {
      app.password.should.equal('a');
    });

  });

  describe('valid & invalid', function () {

    let app;

    beforeAll(() => {
      app = Application({
        username: "a@a.com",
        password: "a",
        confirm: "a"
      });
    });

    it('can be set valid', function () {
      app.status = "valid";
      app.status.should.equal('valid');
    });

    it('can be set invalid', function () {
      app.setInvalid('a invalid message');
      app.status.should.equal('invalid');
      app.message.should.equal('a invalid message');
    });




  });

});
