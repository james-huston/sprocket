var Sprocket = require("../../../");
var expect = require("expect.js");
var url = require("url");

describe("When created an instance of a handler", function() {
  var testRequest = new Sprocket.Request({}, "test123");
  var endpoint = "http://localhost-services.redventures.net/queue.php";
  var handler = new Sprocket.HttpPostEndpoint(testRequest, endpoint);

  it("should create a real instance", function() {
    expect(handler).to.be.a(Sprocket.HttpPostEndpoint);
    expect(handler.request).to.equal(testRequest);
  });

  it("should properly parse a basic test url", function() {
    expect(handler.endpointUrl).to.equal(endpoint);
    expect(handler.url.port).to.equal(80);
    expect(handler.postUrl).to.equal("http://localhost-services.redventures.net");
  });
});

