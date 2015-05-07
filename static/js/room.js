var socket = io();
var room;

(function () {
  'use strict';

  var URLRoomId;
  var playerName;

  function Room(roomInfo, playerInfo) {
    this.cardSequence = [
      "0", "1/2", "1", "2", "3", "5", "8", "13", "20", "40", "100", "?", "coffee"
    ];
    this.users = [];

    this.hand = $("#hand");
    this.playingTable =  $("#table");

    this.currentPlayer = new User(playerInfo);
    this.currentPlayer.isCurrentPlayer = true;
    this.renderHand();
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
    },

    renderHand: function () {
      for (var f = 0; f < this.cardSequence.length; f++) {
        var card = $(nj.render("card.html", {cardValue: this.cardSequence[f]}));
        card.data("value", this.cardSequence[f]);
        this.hand.append(card);
      }
      adjustTableHeight();

      $(document).on("click", "#hand .card", this.currentPlayer.castVote);
    }
  }

  function handleJoinRoom(data) {
    var roomInfo = data.room;
    room = new Room(roomInfo, data.user);

    $('#nameModal').modal('hide');

    if (!URLRoomId) {
      window.location = "#/view/" + roomInfo.id;
    }

    for (var f = 0 ; f < roomInfo.users.length; f++) {
      room.addUser(roomInfo.users[f]);
    }

    socket.on("userJoined", $.proxy(room.addUser, room));
    socket.on("userLeft", $.proxy(room.removeUser, room));
  }

  function adjustTableHeight(){
    $("#table").height($(window).height() - $("#hand").height() - 72);
  }

  (function init(argument) {

    // attempt to extract room id from URL hash
    var match = window.location.hash.match(/^#\/view\/(\d+)$/);
    if (match) {
      URLRoomId = match[1];
    }

    // create the modal
    // $('#nameModal').modal({backdrop: 'static'});

    // handle join modal submission
    // $("#joinRoomForm").submit(function () {
      // playerName = $("#joinRoomForm #name").val();
      playerName = "Nicu";

      socket.on("roomJoined", handleJoinRoom);

      socket.emit("joinRoom", {roomId: URLRoomId, name: playerName});

    //   return false;
    // });

    $(window).resize(adjustTableHeight);
    adjustTableHeight();
  })();

})();
