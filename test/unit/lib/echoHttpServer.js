var http = require('http');

exports = module.exports =
  http.createServer(function (req, res) {
    var dataString = '';

    req.on('data', function (chunk) {
      dataString += chunk.toString();
    });

    req.on('end', function () {
      res.writeHead(200, ['Content-Type', 'application/json']);
      res.end(dataString);
    });
  });
