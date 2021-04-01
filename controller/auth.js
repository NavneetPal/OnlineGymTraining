const User=require('../models/user');
module.exports={
    signin:(req,res)=>{
        const redirectUrl=req.session.returnTo || '/ogt';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    },
    signout:(req,res)=>{
        req.logout();
        res.redirect('/ogt');
    },
    signup:async(req,res,next)=>{
        //user supplied three fields username,password and email
        const {username,password,email}=req.body;
        //creating an instance of user by taking email and username
        const user=new User({email,username});
        //User.register function is provided by passport-local-mongoose
        //Convenince method to register a new user instance(user) with a given password.Checks if username is unique
        const registeredUser=await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err)return next(err);
            res.redirect('/ogt');
        })
        console.log(registeredUser);
        res.redirect('/'); 
    },
    showSignupForm:(req,res)=>{
        res.render('users/signup');
    },
    showSigninForm:(req,res)=>{
        res.render('users/signin');
    }
}