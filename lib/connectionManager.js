exports = module.exports = ConnectionManager;

function ConnectionManager() {
  this.connectionArray = [];
}

ConnectionManager.prototype.add = function (socket) {
  this.connectionArray.push(socket);
  return this;
};

ConnectionManager.prototype.del = function (socket) {
  var socketIndex = this.connectionArray.indexOf(socket);

  if (socketIndex !== -1) {
    this.connectionArray.splice(socketIndex, 1);
  }

  return this;
};

