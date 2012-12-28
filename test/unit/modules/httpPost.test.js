var Sprocket = require('../../../');
var expect = require('expect.js');

describe('Create a test endpoint server that echos', function () {
  var httpServer;

  beforeEach(function (done) {
    httpServer = require('../lib/echoHttpServer');

    httpServer.listen('8090');
    done();
  });

  afterEach(function (done) {
    httpServer.close(function () {
      done();
    });
  });

  describe('and create a test handler and data', function () {
    var dataObject;
    var handler;

    beforeEach(function () {
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

      handler = new Sprocket.Server.modules['HttpPost'](
        dataObject.module.config
      );
    });

    describe('execute handler with test data', function () {
      it('should return the same data', function (done) {
        handler.on('completed', function (responseData) {
          expect(responseData.toString())
            .to.equal(JSON.stringify(dataObject.data));
          done();
        });

        handler.execute(JSON.stringify(dataObject.data));
      });
    });
  });
});


