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

      httpServer.on("error", function (err) {
        console.log("http server error");
        console.log(err.toString());
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

        testServer.on("error", function (err) {
          err = err || {};
          console.log(err.toString);
        });

        done();
      });

      afterEach(function (done) {
        done();
      });

      describe("making a socket request to the server", function () {
        it("should post and return", function (done) {

          testServer.on("request.new", function (request) {
            request.data = request.data || "{}";
            request.data = JSON.parse(request.data.toString());


            var handler = new Sprocket.HttpPostEndpoint(
              request.data,
              request.data.endpoint
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
          });

          testServer.listen("14005", function () {
            var testData =
              '{"data": "blarg", "endpoint": "'
                + endpoint + '"}';

            var connection = net.connect("14005", function () {
              console.log("duty socket connected");
            });

            var responseData = "";
            connection.on("data", function (chunk) {
              responseData += chunk.toString();
              expect(responseData).to.equal("blarg");
              done();
            });

            connection.on("error", function (err) {
              done(err);
            });

            connection.write(testData);

          });

        });
      });
    });
  });
});

