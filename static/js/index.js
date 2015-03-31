$(document).ready(function () {
  var socket = io();

  $("#createRoomBtn").click(function () {

    socket.on("roomCreated", function (data) {
      window.location = "/room?id=" + data.room.id;
    })

    socket.emit("createRoom");

    return false;
  });

  socket.emit('send', { message: "Tada!!!" });
});
