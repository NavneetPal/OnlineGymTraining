const passport =require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User=require('./models/user');
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


passport.use(new GoogleStrategy({
    clientID: '831659796017-ehubk9va6tmb6gn8ruatrpt7hsk932rb.apps.googleusercontent.com',
    clientSecret: '9LAi_F4aOHOPFPwA97eSH5J4',
    callbackURL: "https://pacific-fjord-36977.herokuapp.com/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    //use the profile info(mainly profile id) to check if the user is registered in ur db
    User.findOrCreate({ email: profile.email }, function (err, user) {
      return cb(err, user);
    });
  }
));