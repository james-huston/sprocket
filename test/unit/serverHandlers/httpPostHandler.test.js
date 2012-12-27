var Sprocket = require("../../../");
var expect = require("expect.js");
var url = require("url");

describe("When created an instance of a handler", function() {
  it("should create a real instance", function() {
    var testRequest = new Sprocket.Request({}, "test123");
    var endpoint = "http://localhost-services.redventures.net/queue.php";
    var handler = new Sprocket.HttpPostEndpoint(testRequest, endpoint);

    expect(handler).to.be.a(Sprocket.HttpPostEndpoint);
    expect(handler.request).to.equal(testRequest);
    expect(handler.endpointUrl).to.equal(endpoint);

    console.log(handler);

    expect(handler.url.port).to.equal(80);
    expect(handler.postUrl).to.equal("http://localhost-services.redventures.net");
  });
});

