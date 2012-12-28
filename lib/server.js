var net = require("net");
var connectionManager = require("./connectionManager");
var request = require("./request");
var Emitter = require("events").EventEmitter;
var sys = require("sys");
exports = module.exports = Server;

function Server() {
  this.port = 13001;
  this.listener = null;
  this.connectionManager = new connectionManager();
  this.requestArray = [];
  this.endpoint = "";

  Emitter.call(this);
}

//Server.prototype.__proto__ = Emitter.prototype;
//Server.prototype = Emitter.prototype;
sys.inherits(Server, Emitter);

Server.prototype.listen = function (port, listenCallback) {
  var self = this;

  if (port) {
    this.port = port;
  }

  this.listener = new net.createServer(function (socket) {
    self.callbackListen(self, socket);
  });

  this.listener.on('listening', function () {
    self.emit('listening');
  });

  if (typeof(listenCallback) === "function") {
    this.on("listening", listenCallback);
  }

  this.listener.listen(this.port);
};

Server.prototype.callbackListen = function (server, socket) {
  server.connectionManager.add(socket);

  socket.on("data", function (dataBuffer) {
    server.callbackSocketData(socket, dataBuffer);
  });

  socket.on("end", function () {
    server.callbackSocketEnd(socket);
  });

  socket.on("error", function (err) {
    server.emit("error", err);
  });
};

Server.prototype.callbackSocketData = function (socket, dataBuffer) {
  var currentRequest = new request(socket, dataBuffer);
  this.requestArray.push(currentRequest);
  this.emit("request.new", currentRequest);
};

Server.prototype.callbackSocketEnd = function (socket) {
  this.connectionManager.del(socket);
};

Server.prototype.shutdown = function (callbackShutdown) {
  var self = this;

  this.listener.on('close', function () {
    self.emit('close');
    if (callbackShutdown && typeof (callbackShutdown) === "function") {
        callbackShutdown();
    }
  });

  this.listener.on('error', function () {
    if (callbackShutdown && typeof (callbackShutdown) === "function") {
        callbackShutdown();
    }
  });

  this.listener.close();
};

