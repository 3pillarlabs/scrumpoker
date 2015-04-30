(function () {
  'use strict';

  var socket = io();
  var room, roomId;

  // attempt to extract room id from URL hash
  var hashMatch = window.location.hash.match(/^#\/view\/(\d+)$/);
  if (hashMatch) {
    roomId = hashMatch[1];
  }

  function Room(roomInfo) {
    this.users = [];
    this.playingTable =  $("#table");
  }

  Room.prototype = {
    addUser: function (userJoiningInfo) {
      var user = new User(userJoiningInfo);
      this.users.push(user)
      this.playingTable.append(user.getDOM());
    },

    removeUser: function (userLeavingInfo) {
      var user = _.find(this.users, function (user, index) {
        userIndex = index;
        return user.id == userLeavingInfo.id;
      });

      if (user) {
        user.getDOM().remove();
        this.users.splice(userIndex, 1);
      }
      else {
        // bitch about it
      }
    }
  }

  function handleJoinRoom(roomInfo) {
    room = new Room(roomInfo);
    $('#nameModal').modal('hide');

    if (!roomId) {
      window.location = "#/view/" + roomInfo.id;
    }

    for (var f = 0 ; f < roomInfo.users.length; f++) {
      room.addUser(roomInfo.users[f]);
    }

    socket.on("userJoined", $.proxy(room.addUser, room));
    socket.on("userLeft", $.proxy(room.removeUser, room));
  }

  // create the modal
  $('#nameModal').modal({backdrop: 'static'});

  // handle join modal submission
  $("#joinRoomForm").submit(function () {
    var name = $("#joinRoomForm #name").val();

    socket.on("roomJoined", handleJoinRoom);

    socket.emit("joinRoom", {roomId: roomId, name: name});

    return false;
  });


  function adjustTableHeight(){
    $("#table").height($(window).height() - $("#hand").height() - 72);
  }
  $(window).resize(adjustTableHeight);
  adjustTableHeight();


})();
