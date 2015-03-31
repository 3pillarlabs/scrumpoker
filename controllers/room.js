var plug = require("../plug");

var rooms = [];
var lastRoom = 0;

function Room() {
  this.users = [];
  this.topic = null;
  this.id = this.getUniqId();
}

Room.prototype = {
  getUniqId: function () {
    return "" + lastRoom++;
  }
}

plug.whenPlugged(function (socket) {
  socket.on("createRoom", function (data) {

    // create a new room
    var room =  new Room();
    rooms.push(room);

    socket.join(room.id);

    // store room id for easy identification later on
    socket.pokerInfo = {
      room: room
    }

    socket.emit("roomCreated", {room: room})
  });
});

module.exports = {};
