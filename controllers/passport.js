var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models  = require('../models');
var bcrypt = require('bcrypt');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        models.User.find({ where: {"email": email} }).success(function (user) {
            if (!user || !bcrypt.compareSync(password, user.password))
                return done(null, false, { message: 'Incorrect username or password.' });

            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    models.User.find(id).success(function (user) {
        done(null, user);
    });
});

module.exports = passport
