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

  $("#table .card").click(function(){
    $(this).toggleClass("turned")
  });

  // handle join modal submission
  $("#joinRoomForm").submit(function () {
    var name = $("#joinRoomForm #name").val();

    socket.on("roomJoined", function (data) {
      room = data.room;
      $('#nameModal').modal('hide');

      if (!roomId) {
        window.location = "#/view/" + room.id;
      }
      console.log(room);
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
