(function () {
  'use strict';

  var socket = io();
  var room, roomId;

  // attempt to extract room id from URL hash
  var hashMatch = window.location.hash.match(/^#\/view\/(\d+)$/);
  if (hashMatch) {
    roomId = hashMatch[1];
  }

  // create the modal
  $('#nameModal').modal({backdrop: 'static'});

  // handle join modal submission
  $("#joinRoomForm").submit(function () {
    var name = $("#joinRoomForm #name").val();

    socket.on("roomJoined", function (data) {
      room = data.room;
      $('#nameModal').modal('hide');

      if (!roomId) {
        window.location = "#/view/" + room.id;
      }

      var tableEl = $("#table");

      for (var f = 0 ; f < room.users.length; f++) {
        var user = room.users[f];
        user.cardValue = 1;
        tableEl.append(nj.render("player.html", user))
      }

      $("#table .card").click(function(){
        $(this).toggleClass("turned")
      });
    });

    socket.emit("joinRoom", {roomId: roomId, name: name});

    return false;
  });


  function adjustTableHeight(){
    $("#table").height($(window).height() - $("#hand").height() - 72);
  }
  $(window).resize(adjustTableHeight);
  adjustTableHeight();


})();
