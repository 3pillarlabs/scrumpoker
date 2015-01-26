var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index.html');
});

router.get('/room', function(req, res) {
    res.render('room.html');
});


module.exports = router;
