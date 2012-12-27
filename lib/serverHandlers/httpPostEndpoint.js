var http = require("http");
var url = require("url");

exports = module.exports = HttpPostEndpointHandler;

function HttpPostEndpointHandler(requestObject, endpointUrl) {
  this.request = requestObject;
  this.endpointUrl = endpointUrl;
  this.completed = false;
  this.url = url.parse(endpointUrl);
  this.postUrl = "";
  if (!this.url.port) {
    this.url.port = 80;
  }
  this.postUrl = this.url.protocol + "//" + this.url.host;
}

HttpPostEndpointHandler.prototype.execute = function () {
  var self = this;

  var postData = JSON.stringify(this.request.data);

  var postOptions = {
    host: this.postUrl,
    port: this.url.port,
    path: this.url.path,
    method: "POST",
    headers: {
      "Content-Type:": "application/json",
      "Content-Length": postData.length
    }
  };

  var responseData = "";

  var request = http.request(
    postOptions,
    function (response) {
      response.on("data", function (chunk) {
        responseData += chunk;
      });

      response.on("end", function () {
        this.completed = true;
        self.emit(
          "request.completed",
          self.createResponse(responseData)
        );
      });

      response.on("close", function () {
        if (!this.completed) {
          self.emit(
            "request.completed",
            self.createResponse(responseData)
          );
        }
      });
    }
  );

  request.on("error", function (err) {
    self.emit("request.error", err);
  });

  request.write(postData);

  request.end();
};

HttpPostEndpointHandler.prototype.createResponse = function (data) {
  var response = {};
  response.data = data;
  response.socket = this.request.socket;
  return response;
};

