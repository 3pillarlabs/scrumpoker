$(document).ready(function () {
  var socket = io.connect('http://localhost:3000');

  socket.emit('send', { message: "Tada!!!" });
});
