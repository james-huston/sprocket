

exports = module.exports = Request;

function Request(socket, requestData, endpoint) {
  if (!socket) {
    throw new Error("socket on request cannot be empty");
  }

  if (!requestData) {
    throw new Error("requestData on request cannot be empty");
  }

  endpoint = endpoint || undefined;

  this.socket = socket;
  this.data = requestData;
  this.endpoint = endpoint;
}

