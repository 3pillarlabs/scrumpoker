var plug = require("../plug");
var _ = require("underscore");

var rooms = [];
var lastRoom = 0;

function Room(id) {
  this.users = [];
  this.topic = null;

  if (!id) {
    this.id = this.getUniqId();
  }
  else {
    //TODO: just to be safe, we should double check the id is unique
    this.id = id;
  }
}

Room.prototype = {
  getUniqId: function () {
    return "" + lastRoom++;
  }
}

function User(name, id) {
  this.name = name;
  this.id = id;
}

plug.whenPlugged(function (socket) {

  socket.on("joinRoom", function (data) {
    var room;

    /* if we received and id we try to find the room
       or create one with that id otherwise */
    if (data.roomId) {
      room = _.find(rooms, function (roomItem) {
        return roomItem.id == data.roomId;
      });

      if (!room) {
        room =  new Room(data.roomId);
      }
    }
    else {
      room =  new Room();
    }

    rooms.push(room);
    socket.join(room.id);

    var user = new User(data.name, room.users.length);
    room.users.push(user);

    socket.pokerInfo = {
      room: room,
      user: user
    };

    socket.emit("roomJoined", room);

    socket.broadcast.to(room.id).emit('userJoined', user);
  });

  socket.on("disconnect", function (data) {
    if (socket.pokerInfo) {
      var user = socket.pokerInfo.user;
      var room = socket.pokerInfo.room;

      //TODO: make this more efficient
      room.users = _.filter(room.users, function (item) {
        return item !== user;
      });

      socket.broadcast.to(room.id).emit('userLeft', user);
    }
  });

});

module.exports = {};
