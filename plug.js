var io;
var plugCallbacks = [];
var socket;

module.exports = {

  listen: function (server) {
    io = require('socket.io').listen(server);

    io.on("connection", function (_socket) {
      for (var f = 0; f < plugCallbacks.length; f++) {
        plugCallbacks[f].call(this, _socket);
      }

      socket = _socket;
    });
  },

  whenPlugged: function (callback) {
    if (typeof callback === 'function') {
      if (!socket) {
        plugCallbacks.push(callback);
      }
      else {
        callback.call(this, socket);
      }
    }
    else {
        console.error("Plug's whenPlugged must be a function, got", typeof callback);
    }
  }
}
