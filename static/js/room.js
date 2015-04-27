(function () {
  'use strict';

  var socket = io();
  var room, roomId;
  var playingTable = $("#table");
  var users = [];

  // attempt to extract room id from URL hash
  var hashMatch = window.location.hash.match(/^#\/view\/(\d+)$/);
  if (hashMatch) {
    roomId = hashMatch[1];
  }

  function addUser(userJoining) {
    userJoining.playerDOM = $(nj.render("player.html", userJoining));
    users.push(userJoining)
    playingTable.append(userJoining.playerDOM);
  }

  function removeUser(userLeaving) {
    var user = _.find(users, function (user) {
      return user.id == userLeaving.id;
    });

    user.playerDOM.remove();
  }


  function handleJoinRoom(roomInfo) {
    room = roomInfo.room;
    $('#nameModal').modal('hide');

    if (!roomId) {
      window.location = "#/view/" + room.id;
    }

    for (var f = 0 ; f < room.users.length; f++) {
      var user = room.users[f];
      addUser(user);
    }

    socket.on("userJoined", addUser);
    socket.on("userLeft", removeUser);
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
