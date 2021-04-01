const express=require('express');
const router=express.Router();
const passport=require('passport');
const {isLoggedIn}=require('../middleware/middleware');
const {signin,signup,signout,showSignupForm,showSigninForm}=require('../controller/auth');

router.get('/signup',showSignupForm);
router.post('/signup',signup);
router.get("/signin",showSigninForm);
//passport authenticate function take the strategy(like local,google,twitter) and then some options
router.post("/signin",passport.authenticate('local',{failureFlash:true,failureRedirect:'/signin'}),signin);
router.get('/signout',signout);

module.exports=router;