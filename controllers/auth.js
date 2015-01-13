var express = require('express');
var router = express.Router();
var models  = require('../models');
var bcrypt = require('bcrypt');
var passport = require('./passport')

router.get('/register', function(req, res) {
    res.render('register.html');
});

router.post('/register', function(req, res) {
    bcrypt.genSalt(function(err, salt)
    {
        bcrypt.hash(req.body.password, salt, function(err, hash)
        {
            models.User.create({
                username: req.body.email.split("@")[0],
                email: req.body.email,
                password: hash
            }).success(function() {
                res.redirect('/');
            });
        });
    });
});




router.get('/login', function(req, res) {
    res.render('login.html', { message: req.flash('error') });
});

router.post('/login',
passport.authenticate('local', { successRedirect: '/',
failureRedirect: '/user/login',
failureFlash: true }));

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;
