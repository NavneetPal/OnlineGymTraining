const express=require('express');
const router=express.Router();
const passport=require('passport')
const {isLoggedIn}=require('../middleware/middleware');
const {signin,signup,signout,showSignupForm,showSigninForm}=require('../controller/auth');

router.get('/signup',showSignupForm);
router.post('/signup',signup);
router.get("/signin",showSigninForm);
router.post("/signin",passport.authenticate('local',{failureRedirect:'/signin'}),signin);
router.get('/signout',signout);

module.exports=router;