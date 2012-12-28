var Sprocket = require("../../");
var expect = require("expect.js");
var http = require("http");
var net = require("net");

describe("When creating a server", function () {
  describe("using a test endpoint", function () {
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

    describe("and attaching a http handler", function () {
      var testServer;

      beforeEach(function (done) {
        testServer = new Sprocket.Server();
        console.log("server running");
        done();
      });

      afterEach(function (done) {
        console.log("server shutdown");
        testServer.shutdown(done);
      });

      describe("making a socket request to the server", function (done) {
        console.log("testing");
        it("should post and return", function () {
          testServer.listen("14005", function () {
            console.log("listening");
          });

          testServer.on("request.new", function (request) {
            var handler = new Sprocket.HttpPostEndpointHandler(
              request,
              request.endpoint
            );

            handler.on("request.completed", function (response) {
              response = response || {};

              if (response.data) {
                request.socket.write(response.data);
              } else if (response.error) {
                throw new Error(response.error);
              } else {
                throw new Error("Invalid response from handler");
              }
            });

            handler.execute();

            var testData = '{data: "blarg", endpoint: "http://localhost:8090/test"}';

            var connection = net.connect("14005", function (socket) {
              var responseData = "";
              socket.on("data", function (chunk) {
                responseData += chunk.toString();
                console.write(responseData);
                expect(responseData).to.equal(testData);
                done();
              });

              socket.on("error", function (err) {
                done(err);
              });

              socket.write(testData);
            });

          });
        });
      });
    });
  });
});

