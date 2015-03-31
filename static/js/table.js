function adjustTableHeight(){
  $("#table").height($(window).height() - $("#hand").height() - 72);
}

$(document).ready(function(){
  $('#nameModal').modal();

  $(window).resize(adjustTableHeight);
  adjustTableHeight();

  $("#table .card").click(function(){
    $(this).toggleClass("turned")
  })
});
