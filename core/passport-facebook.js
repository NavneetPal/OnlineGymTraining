const FacebookStrategy = require('passport-facebook').Strategy;
const User=require('../models/user');


module.exports=function(passport){
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "https://pacific-fjord-36977.herokuapp.com/auth/facebook/callback"
      },
      async function(accessToken, refreshToken, profile, done) {
    
        const newUser=new User({
          username:profile.displayName,
          facebookId:profile.id
        });
        try {
          const currentUser=await User.findOne({facebookId:profile.id});
          if(!currentUser){
           const user=await newUser.save({validateBeforeSave:false});
            done(null,user);
          }else{
            done(null,currentUser);
          }
        } catch (error) {
          done(error)
        }
        console.log(profile);
      }
    ));
}
