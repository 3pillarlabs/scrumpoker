var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/hello', function(req, res) {
    res.send({ who: 'world' });
});

module.exports = router;
