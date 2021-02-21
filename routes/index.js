const express=require('express')
const router=express.Router()
const User=require('../models/user')
const passport=require('passport')
const {isLoggedIn}=require('../middleware');
//const catchAsync=require('../utils/catchAsync');

router.get(("/"),(req,res)=>{
    res.redirect('/ogt');
});
router.get(("/ogt"),(req,res)=>{
    res.render('home');
});
router.post("/subscribe",(req,res)=>{
    const {email,js}=req.body;
    console.log(req.body);

    const mcData={
        members:[
        {
            email_address:email,
            status:'pending'
        }
      ]
    }

    const mcDataPost= JSON.stringify(mcData);
   
    const api_key=process.env.API_KEY;


    const options={
        url:'https://us7.api.mailchimp.com/3.0/lists/2e70591c02',
        method:'POST',
        headers:{
            Authorization:`auth ${api_key}`
        },
        body:mcDataPost
    }

    if(email){
        request(options,(err,response,body)=>{
            if(err){
                res.json({error: err});
            }else{
                if(js){
                    res.sendStatus(200);
                }else{
                    res.redirect('/ogt');
                } 
            }
        })
    }else{
        res.status(404).send({message:'Failed'})
    }
})

router.get('/about',(req,res)=>{
    res.render('about');
})

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