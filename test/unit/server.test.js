var Sprocket = require("../../");
var server = Sprocket.Server;
var expect = require("expect.js");
var net = require("net");

var clientClose = function() {
  testServer.shutdown();
};

describe("When started a server", function () {

  it("should have no connections", function (done) {
    var testServer = new server();

    testServer.on("listening", function() {
      expect(this.connectionManager.connectionArray.length)
        .to.equal(0);
      this.shutdown(done);
    });

    testServer.listen(14000);
  });

  it("should accept, add, and del a connection", function (done) {
    var testServer = new server();
    testServer.listen(14001);

    testServer.on("connection", function () {
      expect(testServer.connectionManager.connectionArray.length)
        .to.equal(1);
    });

    var client = net.connect(14001);

    client.on("close", function () {
      expect(testServer.connectionManager.connectionArray.length)
        .to.equal(0);
      testServer.shutdown(done);
    });
    client.on("error", clientClose);

    expect(client).to.be.a(net.Socket);

    client.destroy();
  });

});

describe("A running server", function (clientClose) {
  var testServer;

  beforeEach(function(done) {
    testServer = new server();
    testServer.on("listening", function () {
      done();
    });
    testServer.listen(14002);
  });

  afterEach(function(done) {
    testServer.shutdown(done);
  });

  describe("will received data and", function () {
    describe("when using an overridden function", function () {
      it("will call the callbackSocketData callback", function (done) {
        testServer.callbackSocketData = function (socket, dataBuffer) {
          expect(socket).to.be.a(net.Socket);
          var dataString = dataBuffer.toString();
          expect(dataString).to.equal("test123");
          done();
        };

        var client = net.connect(14002, function () {
          this.end("test123");
          this.destroy();
        });
      });
    });

    describe("when passed some data", function () {
      it("will create a request object and attach it to the requestArray property", function (done) {
        testServer.on("request.new", function (request) {
          expect(request.data.toString()).to.equal("blargme");
          expect(request.socket).to.equal(
            testServer.connectionManager.connectionArray[0]
          );
          done();
        });

        var client = net.connect(14002, function () {
          this.end("blargme");
          this.destroy();
        });
      });
    });
  });
});

