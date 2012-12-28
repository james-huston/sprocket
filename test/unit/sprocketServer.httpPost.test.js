var Sprocket = require('../../');
var expect = require('expect.js');
var axon = require('axon');

describe('Using a mock echo http server', function () {
  var httpServer;

  beforeEach(function (done) {
    httpServer = require('./lib/echoHttpServer');

    httpServer.listen('8090');
    done();
  });

  afterEach(function (done) {
    httpServer.close(function () {
      done();
    });
  });

  describe('create a sprocket server and test message', function () {
    var dataObject;
    var sprocketServer;

    beforeEach(function (done) {
      dataObject = {
        data: {
          value: 'blarg!'
        },
        module: {
          name: 'HttpPost',
          config: {
            url: 'http://localhost:8090/test'
          }
        }
      };

      sprocketServer = new Sprocket.Server(14001);

      sprocketServer.on('listening', function () {
        done();
      });

      sprocketServer.listen();
    });

    afterEach(function (done) {
      sprocketServer.close(done);
    });

    describe('sending the message to the server', function () {
      it('should return the data from the message as a string',
        function (done) {
          var request = axon.socket('req');

          request.send(
            JSON.stringify(dataObject),
            function (responseBuffer) {
              expect(responseBuffer.toString())
                .to.equal(JSON.stringify(dataObject.data));
              done();
            }
          );

          request.connect(14001);
        }
      );
    });
  })
});