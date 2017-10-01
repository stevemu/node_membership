let chai = require('chai');
let should = chai.should();
let expect = chai.expect;
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

let User = require('./User');
describe('User', function () {
    describe('defaults', function () {

        // more specs
      let user;
      beforeAll(function () {
        user = new User({username: "a@a.com"});
      });

      test.only('should have an username', function () {
        user.username.should.equal('a@a.com');
      });

      test('should have a null password', function () {
        expect(user.hashedPassword).to.be.null;
      });

    });
});
