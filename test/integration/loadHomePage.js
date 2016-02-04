var assert = require('assert');
var mocha = require('mocha');
var webdriverio = require('webdriverio');

var options = {
  desiredCapabilities: {
    browserName: 'chrome'
  },
  baseUrl: 'http://localhost:1337',
  waitforTimeout: 1000
};

var client;

beforeEach(function (done) {
  client = webdriverio.remote(options);
  client.init(done);
});

describe('home page integration tests', function () {
  this.timeout(8000);

  it('should load the unauthenticated homepage', function () {
    return client
      .url('http://localhost:1337')
      .getTitle().then(function(title) {
        assert.equal(title, 'Federalist');
      })
  });

  it('should load the authenticated site listing', function () {
    return client
      .url('http://localhost:1337')
      .click('[href="/auth/github"]')
      .waitForExist('#login')
      .setValue('#login_field', 'FederalistTestingUser')
      .setValue('#password', process.env.FEDERALIST_TEST_PASSWORD)
      .submitForm('#login_field')
      .waitForExist('.list')
      .execute(function() {
        return window.federalist.user.attributes.username;
      })
      .then(function(username) {
        assert.equal(username.value, 'FederalistTestingUser');
      });
  });

});

afterEach(function (done) {
  client.end(done);
});