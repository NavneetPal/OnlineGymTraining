const FacebookStrategy = require('passport-facebook').Strategy;
const User=require('../models/user');


module.exports=function(passport){
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "https://pacific-fjord-36977.herokuapp.com/auth/facebook/callback",
        
      },
      async function(accessToken, refreshToken, profile, done) {
        try {
          const currentUser=await User.findOne({facebookId:profile.id});
          if(currentUser){
              done(null,currentUser);
          }
          console.log(profile);
          const email=profile.emails[0].value;
          const username=profile.displayName;

           //if user with the existing email already exist in the database
           const checkEmail = await User.checkExistingField("email", email);
           if (checkEmail) {
               console.log(checkEmail);
             const user = await User.findByIdAndUpdate(
               checkEmail._id,
               { facebookId: profile.id },
               { new: true }
             );
              done(null, user);
           }

           const userObj = new User({
            facebookId: profile.id,
            username,
            email,
            });
            const user = await userObj.save({ validateBeforeSave: false });

            done(null, user);

        } catch (error) {
          done(error,false)
        }
      }
    ));
}
