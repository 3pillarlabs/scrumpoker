var plug = require("../plug");
var _ = require("underscore");

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

function User(name) {
  this.name = name;
}

plug.whenPlugged(function (socket) {
  socket.on("createRoom", function (data) {

    // create a new room
    var room =  new Room();
    rooms.push(room);

    socket.join(room.id);

    // store room id for easy identification later on
    // socket.pokerInfo = {
    //   room: room
    // };

    socket.emit("roomCreated", {room: room})
  });

  socket.on("joinRoom", function (data) {
    var room = _.find(rooms, function (room) {
      return room.id == data.roomId;
    });

    if (!room) {
      // bitch about it
      return;
    }

    var user = new User(data.name);

    // socket.pokerInfo.user = user;
    room.users.push(user);

    console.log(room);
  });
});

module.exports = {};
