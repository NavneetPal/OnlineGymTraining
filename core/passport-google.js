const GoogleSrategy=require('passport-google-oauth20').Strategy;
const User=require('../models/user');


module.exports=function(passport){
    passport.use(
        new GoogleSrategy({
            clientID:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:'https://pacific-fjord-36977.herokuapp.com/auth/google/callback',
        },
        async(accessToken,refreshToken,profile,done)=>{
            try {

                //If user already exist 
                const currentUser=await User.findOne({googleId:profile.id});
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
                    { googleId: profile.id },
                    { new: true }
                  );
                   done(null, user);
                }

                //It creates a new user in which password will not be there as we have done validationBeforeSave to false
                const userObj = new User({
                    googleId: profile.id,
                    username,
                    email,
                });
                const user = await userObj.save({ validateBeforeSave: false });

                 done(null, user);

            } catch (err) {
                done(err,false)
            }
        }
        )
    )
}