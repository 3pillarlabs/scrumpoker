var express = require('express');
var router = express.Router();
var plug = require("../plug");


/* GET home page. */
router.get('/hello', function(req, res) {
    res.send({ who: 'world' });
});

plug.whenPlugged(function (socket) {
    socket.on("send", function (data) {
      console.log(data);
  });
})

module.exports = router;
