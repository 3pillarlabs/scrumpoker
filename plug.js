var io = require('socket.io');
var connectionCallbacks = [];
var socket;

module.exports = {
    listen: function (server) {
        io.listen(server);

        io.on("connection", function (_socket) {
            for (var f = 0; f < connectionCallbacks.length; f++)
            {
                connectionCallbacks[f].call(_socket);
            }

            socket = _socket;
        });
    },
    onConnection: function (callback) {
        if (typeof callback === 'function')
        {
            if (!socket)
            {
                connectionCallbacks.push(callback);
            }
            else
            {
                callback.call(socket);
            }
        }
        else
        {
            console.error("Plug's onConnection must be a function, got", typeof callback);
        }
    }
}
