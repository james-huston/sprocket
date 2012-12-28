var axon = require('axon');
var emitter = require('events').EventEmitter;
var util = require('util');

module.exports = SprocketServer;

function SprocketServer(port) {
  this.port = port || 14000;

  emitter.call(this);

  this.responder = axon.socket('rep');

  this.responder.on('message', this.emitMessage.bind(this));
}

SprocketServer.modules = {};

util.inherits(SprocketServer, emitter);

SprocketServer.prototype.listen = function (port, listeningCallback) {
  this.port = port || this.port;

  this.responder.on('bind', this.emit.bind(this, 'listening'));

  if ('function' === typeof(listeningCallback)) {
    this.responder.on('bind', listeningCallback);
  }

  this.responder.bind(this.port);
};

SprocketServer.prototype.close = function (closeCallback) {
  this.responder.on('close', this.emit.bind(this, 'close'));

  if ('function' === typeof(closeCallback)) {
    this.responder.on('close', closeCallback);
  }

  this.responder.close();
};

SprocketServer.prototype.emitMessage = function (msg, reply) {
  this.emit('message', msg, reply);
  this.defaultMessageHandler(msg, reply);
};

SprocketServer.prototype.defaultMessageHandler = function (msg, reply) {
  var messageObject = JSON.parse(msg.toString());

  this.validateMessage(messageObject);

  var handler = new SprocketServer.modules[messageObject.module.name](
    messageObject.module.config
  );

  handler.on('completed', function (responseString) {
    reply(responseString);
  });

  handler.execute(JSON.stringify(messageObject.data));
};

SprocketServer.prototype.validateMessage = function (messageObject) {
  if (!messageObject.data) {
    throw new Error('Missing data from message object');
  }

  if (!messageObject.module) {
    throw new Error('Missing module from message object');
  }

  if (!messageObject.module.name) {
    throw new Error('Missing module.name from message object');
  }

  if (!messageObject.module.config) {
    throw new Error('Missing module.config from message object');
  }
};

