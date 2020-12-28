const express=require('express')
const router=express.Router()
const User=require('../models/user')
const passport=require('passport')
//const catchAsync=require('../utils/catchAsync');

router.get('/signup',(req,res)=>{
    res.render('users/signup');
})

router.post('/signup',async(req,res,next)=>{
    const {username,password,email}=req.body;
    const user=new User({email,username});
    const registeredUser=await User.register(user,password);
    req.login(registeredUser,err=>{
        if(err)return next(err);
        res.redirect('/ogt');
    })
    console.log(registeredUser);
    res.redirect('/');
})


router.get("/signin",(req,res)=>{
    res.render('users/signin');
})

router.post("/signin",passport.authenticate('local',{failureRedirect:'/signin'}),(req,res)=>{
    const redirectUrl=req.session.returnTo || '/ogt';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})



router.get('/signout',(req,res)=>{
    req.logout();
    res.redirect('/ogt');
})


module.exports=router;