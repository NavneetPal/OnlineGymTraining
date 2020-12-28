const express=require('express')
const router=express.Router()
const {isLoggedIn}=require('../middleware');

router.get('/about',isLoggedIn,(req,res)=>{
    res.render('about');
})

module.exports=router;