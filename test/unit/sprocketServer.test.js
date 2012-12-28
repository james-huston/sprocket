var Sprocket = require('../../');
var expect = require('expect.js');
var axon = require('axon');

describe('Creating a test SprocketServer', function () {
  var server;

  beforeEach(function (done) {
    server = new Sprocket.Server(14001);

    server.on('listening', function () {
      done();
    });

    server.listen();
  });

  afterEach(function (done) {
    server.close(done);
  });

  describe('and registering a listener to echo messages', function () {
    describe('when passing it a real json message', function () {
      var testValue = JSON.stringify({
        data: 'blarg'
      });

      it('should respond respond with the send message', function (done) {
        server.defaultMessageHandler = function (msg, reply) {
          expect(msg.toString()).to.equal(testValue);
          reply(msg);
        };

        var request = axon.socket('req');

        request.connect(14001);

        request.send(testValue, function (responseMessage) {
          expect(responseMessage.toString()).to.equal(testValue);
          done();
        });
      });
    });
  });
});

