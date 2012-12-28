var http = require('http');
var url = require('url');
var emitter = require('events').EventEmitter;
var util = require('util');

module.exports = HttpPost;

function HttpPost(config) {
  if (!config || !config.url) {
    throw new Error('Missing config for HttpPost module');
  }

  this.url = url.parse(config.url);

  emitter.call(this);
}

util.inherits(HttpPost, emitter);

HttpPost.prototype.execute = function (data) {
  var self = this;

  if (!data) {
    throw new Error('Missing data for HttpPost execute');
  }

  var postOptions = {
    host: this.postUrl,
    port: this.url.port,
    path: this.url.path,
    method: 'POST',
    headers: {
      'Content-Type:': 'application/json',
      'Content-Length': data.length
    }
  };

  var responseData = '';

  var completed = false;

  var request = http.request(
    postOptions,
    function (response) {
      response.on('data', function (chunk) {
        responseData += chunk;
      });

      response.on('end', function () {
        completed = true;
        self.emit(
          'completed',
          self.createResponse(responseData)
        );
      });

      response.on('close', function () {
        if (!completed) {
          self.emit(
            'completed',
            self.createResponse(responseData)
          );
        }
      });
    }
  );

  request.on('error', function (err) {
    self.emit('error', err);
  });

  request.write(data);

  request.end();
};

HttpPost.prototype.createResponse = function (data) {
  return data;
};



