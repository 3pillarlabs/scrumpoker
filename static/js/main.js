$(document).ready(function () {
  var socket = io();

  socket.emit('send', { message: "Tada!!!" });
});
