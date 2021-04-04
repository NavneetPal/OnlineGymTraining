const express=require('express');
const router=express.Router();
const passport=require('passport')

//auth with google
router.get('/google',passport.authenticate('google',{scope:['profile','email']}))

//callback for google to redirect to
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/signin' }),
    (req, res) => {
      res.redirect('/ogt')
    }
)

router.get('/facebook',passport.authenticate('facebook'))

router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/signin' }),
  (req, res)=>{
    // Successful authentication, redirect home.
    res.redirect('/ogt');
  });

module.exports=router