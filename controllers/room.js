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

function User(name) {
  this.name = name;
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
        return;
      }
    }
    else {
      room =  new Room();
    }

    rooms.push(room);
    socket.join(room.id);

    var user = new User(data.name);
    room.users.push(user);

    socket.pokerInfo = {
      room: room,
      user: user
    };

    socket.emit("roomJoined", {
      room: room
    })
  });

  socket.on("disconnect", function (data) {
    if (socket.pokerInfo) {
      var user = socket.pokerInfo.user;

      socket.pokerInfo.room.users = _.filter(socket.pokerInfo.room.users, function (item) {
        return item !== user;
      });      
    }
  });

});

module.exports = {};
