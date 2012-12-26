

exports = module.exports = Request;

function Request(socket, request) {
  this.socket = socket;
  this.data = request;
  this.response = null;
}

