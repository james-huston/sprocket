var Sprocket = require("../../../");
var expect = require("expect.js");
var http = require("http");

describe("When created an instance of a handler", function () {
  var testRequest = new Sprocket.Request({}, "test123");
  var endpoint = "http://localhost-services.redventures.net:8090/queue.php";
  var handler = new Sprocket.HttpPostEndpoint(testRequest, endpoint);

  it("should create a real instance", function () {
    expect(handler).to.be.a(Sprocket.HttpPostEndpoint);
    expect(handler.request).to.equal(testRequest);
  });

  it("should properly parse a basic test url", function () {
    expect(handler.endpointUrl).to.equal(endpoint);
    expect(handler.url.port).to.equal("8090");
    expect(handler.postUrl).to.equal(
      "localhost-services.redventures.net"
    );
    expect(handler.url.path).to.equal("/queue.php");
  });
});

describe("When using a test endpoint", function () {
  var httpServer;
  var endpoint = "http://localhost:8090/test";

  beforeEach(function (done) {
    httpServer = http.createServer(function (req, res) {
      var dataString = "";

      req.on("data", function (chunk) {
        dataString += chunk.toString();
      });

      req.on("end", function () {
        res.writeHead(200, ["Content-Type", "application/json"]);
        res.end(dataString);
      });
    });

    httpServer.listen("8090");
    done();
  });

  afterEach(function (done) {
    httpServer.close(function () {
      done();
    });
  });

  describe("and a simple payload", function () {
    it("should receive back the same data in the response", function (done) {
      var testRequest = new Sprocket.Request({}, "test123");
      var handler = new Sprocket.HttpPostEndpoint(testRequest, endpoint);

      expect(handler.url.port).to.equal("8090");
      expect(handler.postUrl).to.equal("localhost");

      handler.on("request.completed", function (response) {
        expect(response.data).to.equal("test123");
        done();
      });

      handler.on("request.error", function (err) {
        done(err);
      });

      handler.execute();
    });
  });
});

