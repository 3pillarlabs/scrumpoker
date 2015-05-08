var socket = io();
var room;

(function () {
  'use strict';

  var URLRoomId;
  var playerName;

  function Room() {
    this.cardSequence = [
      "0", "1/2", "1", "2", "3", "5", "8", "13", "20", "40", "100", "?", "coffee"
    ];
    this.users = [];

    this.hand = $("#hand");
    this.playingTable =  $("#table");

    $(window).resize($.proxy(this.adjustTableHeight, this));
    this.adjustTableHeight();

    this.currentPlayer = null;
  }

  Room.prototype = {
    addUser: function (userJoiningInfo) {
      var user = new User(userJoiningInfo);
      this.users.push(user)
      this.playingTable.append(user.getDOM());
    },

    removeUser: function (userLeavingInfo) {
      var userIndex;
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

      this.adjustTableHeight();

      $(document).on("click", "#hand .card", this.currentPlayer.castVote);
    },

    handleUserVote: function (voter) {
      var votingUser = _.find(this.users, function (user) {
        return user.id === voter.id;
      });

      votingUser.getDOM().find(".card").removeClass("hidden");
    },

    join: function (data) {

      this.currentPlayer = new User(data.user);
      this.currentPlayer.isCurrentPlayer = true;
      this.renderHand();

      var roomInfo = data.room;

      $('#nameModal').modal('hide');

      if (!URLRoomId) {
        window.location = "#/view/" + roomInfo.id;
      }

      for (var f = 0 ; f < roomInfo.users.length; f++) {
        this.addUser(roomInfo.users[f]);
      }

      socket.on("userJoined", $.proxy(this.addUser, this));
      socket.on("userLeft", $.proxy(this.removeUser, this));
      socket.on("userVoted", $.proxy(this.handleUserVote, this));
    },

    adjustTableHeight: function () {
      this.playingTable.height($(window).height() - $("#hand").height() - 72);
    }
  };

  (function init() {

    room = new Room();

    // attempt to extract room id from URL hash
    var match = window.location.hash.match(/^#\/view\/(\d+)$/);
    if (match) {
      URLRoomId = match[1];
    }

    // create the modal
    $('#nameModal').modal({backdrop: 'static'});

    // handle join modal submission
    $("#joinRoomForm").submit(function () {
      playerName = $("#joinRoomForm #name").val();
      // playerName = "Nicu";

      socket.on("roomJoined", $.proxy(room.join, room));
      socket.emit("joinRoom", {roomId: URLRoomId, name: playerName});

      return false;
    });

  })();

})();
