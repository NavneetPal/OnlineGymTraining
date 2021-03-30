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
        const {username,password,email}=req.body;
        const user=new User({email,username});
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