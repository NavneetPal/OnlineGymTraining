const User=require('../models/user');
module.exports={
    signin:(req,res)=>{
        //the user is signedin sucessfully till now by the passport.authenticate('local')
        //but here we are handling the return to behaviour so that we can return the user to the oage fro where they have come
        const redirectUrl=req.session.returnTo || '/ogt';
        delete req.session.returnTo; //->for delteig the returnTo variale from the session we use delete keyword
        res.redirect(redirectUrl);
    },
    signout:(req,res)=>{
        req.logout();
        req.flash('success','Log out Successfully')
        res.redirect('/ogt');
    },
    signup:async(req,res,next)=>{
        try {
            //user supplied three fields username,password and email
            const {username,password,email}=req.body;
            //creating an instance of user by taking email and username
            const user=new User({email,username});
            //User.register function is provided by passport-local-mongoose
            //Convenince method to register a new user instance(user) with a given password.Checks if username is unique
            const registeredUser=await User.register(user,password);
            //req.login is a function given by passport
            //passport.authenticate() midlleware invokes req.login() automatically
            //This function is primarily used when user signup,during which req.login() can be invoked automatically log in the newly registered user
            //This function still, require a callback which has an err parameter
            req.login(registeredUser,err=>{
                if(err)return next(err);
                //Now user is sucessfully registerd and we have also looged in the user by using req.login() function
                //Redirecting to the homepage
                res.redirect('/ogt');
            })
        } catch (e) {
            req.flash('error',e.message);
            res.redirect('/signup');
        }
         
    },
    showSignupForm:(req,res)=>{
        res.render('users/signup');
    },
    showSigninForm:(req,res)=>{
        res.render('users/signin');
    }
}