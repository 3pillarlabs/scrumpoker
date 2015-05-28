var plug = require("../plug");
var _ = require("underscore");
var io;

var rooms = [];
var votes = {};
var lastRoom = 0;

function Room(id) {
  this.users = [];
  this.topic = null;
  this.isVotingFinished = false;

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
  },

  finishVoting: function () {
    this.isVotingFinished = true;
    io.sockets.in(this.id).emit('voteFinished', votes[this.id]);
  },

  restartVoting: function () {
    this.isVotingFinished = false;
    votes[this.id] = {};

    io.sockets.in(this.id).emit('voteRestarted');
  }
}

function User(name, id) {
  this.name = name;
  this.id = id;
  this.isScrumMaster = false;
}

plug.whenPlugged(function (socket, _io) {

  io = _io;

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

    votes[room.id] = {};
    rooms.push(room);
    socket.join(room.id);

    var user = new User(data.name, room.users.length);
    if (room.users.length === 0) {
      user.isScrumMaster = true;
    }
    room.users.push(user);

    socket.pokerInfo = {
      room: room,
      user: user
    };

    socket.emit("roomJoined", {
      room: room,
      user: user
    });

    socket.broadcast.to(room.id).emit('userJoined', user);
  });

  socket.on("vote", function (data) {
    var room = socket.pokerInfo.room;

    if (room.isVotingFinished) {
      console.error("Voting is finished. Better luck next time.");
      return;
    }

    var voter = socket.pokerInfo.user;
    var voteValue = data.voteValue;

    votes[room.id][voter.id] = voteValue;

    socket.broadcast.to(room.id).emit('userVoted', voter);

    var allVoted = true;

    for (var f = 0; f < room.users.length; f++) {
      var user = room.users[f];

      if (votes[room.id][user.id] === undefined) {
        allVoted = false;
        break;
      }
    }

    if (allVoted) {
      room.finishVoting();
    }
  });

  socket.on("finishVoting", function () {
    var user = socket.pokerInfo.user;
    var room = socket.pokerInfo.room;
    var scrumMaster = _.find(room.users, function (userItem) {
      return userItem.isScrumMaster === true;
    });

    if (user.id !== scrumMaster.id) {
      console.error("You're not a scrum master nor cool, so you can't finish the voting");
      return;
    }

    room.finishVoting();
  });

  socket.on("restartVoting", function () {
    var room = socket.pokerInfo.room;
    var user = socket.pokerInfo.user;
    var scrumMaster = _.find(room.users, function (userItem) {
      return userItem.isScrumMaster === true;
    });

    if (!room.isVotingFinished) {
      console.error("You can't restart what didn't end");
      return;
    }

    if (user.id !== scrumMaster.id) {
      console.error("You're not a scrum master nor cool, so you can't restart the voting");
      return;
    }

    room.restartVoting();
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
