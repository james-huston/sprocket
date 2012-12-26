var Sprocket = require("../../");
var server = Sprocket.Server;
var expect = require("expect.js");
var net = require("net");

var clientClose = function() {
  testServer.shutdown();
};

describe("When started a server", function () {

  it("should have no connections", function () {
    var testServer = new server();

    testServer.on("listening", function() {
      expect(this.connectionManager.connectionArray.length)
        .to.equal(0);
      this.shutdown();
    });

    testServer.listen(14000);
  });

  it("should be listening on set port", function () {
    var testServer = new server();
    testServer.listen(14001);

    testServer.on("connection", function () {
      expect(testServer.connectionManager.connectionArray.length)
        .to.equal(1);
    });

    it("should accept, add, and del a connection", function () {
      var client = net.connect(14001);
      client.on("close", function () {
        expect(testServer.connectionManager.connectionArray.length)
          .to.equal(0);
        testServer.shutdown();
      });
      client.on("error", clientClose);

      expect(client).to.be.a(net.Socket);
      client.end();
    });
  });

});

describe("A running server", function (clientClose) {

  describe("will received data and", function () {
    describe("when using an overridden function", function () {
      it("will call the callbackSocketData callback", function () {
        var testServer;
        testServer = new server();
        testServer.listen(14002);

        testServer.callbackSocketData = function (socket, dataBuffer) {
          expect(socket).to.be.a(net.Socket);
          var dataString = dataBuffer.toString();
          expect(dataString).to.equal("test123");
        };

        var client = net.connect(14002, function () {
          this.write("test123");
          this.end();
        });
        
        client.on("close", function () {
          testServer.shutdown();
        });
        client.on("error", function() {
          testServer.shutdown();
        });
      });
    });

    describe("when passed some data", function () {
      it("will create a request object and attach it to the requestArray property", function () {
        var testServer;
        testServer = new server();
        testServer.listen(14003);

        testServer.on("request.new", function (request) {
          expect(request.data.toString()).to.equal("blargme");
          expect(request.socket).to.equal(
            testServer.connectionManager.connectionArray[0]
          );
        });

        var client = net.connect(14003, function () {
          this.write("blargme");
          this.end();
        });

        client.on("close", function () {
          testServer.shutdown();
        });
        client.on("error", function() {
          testServer.shutdown();
        });
      });
    });
  });
});

