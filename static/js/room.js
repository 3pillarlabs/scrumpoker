(function () {

  var socket = io();

  function getParam(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  function adjustTableHeight(){
    $("#table").height($(window).height() - $("#hand").height() - 72);
  }

  $(document).ready(function(){
    $('#nameModal').modal();

    $(window).resize(adjustTableHeight);
    adjustTableHeight();

    $("#table .card").click(function(){
      $(this).toggleClass("turned")
    });

    $("#joinRoomForm").submit(function () {
      var name = $("#joinRoomForm #name").val();
      var roomId = getParam("id");
      socket.emit("joinRoom", {roomId: roomId, name: name});

      return false;
    });
  });

})();
