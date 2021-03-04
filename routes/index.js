const express=require('express');
const router=express.Router();
const User=require('../models/user');
const {showHomePage,showHome,subscribeNewsletter,showAboutPage}=require('../controller/index');

router.get(("/"),showHomePage);
router.get(("/ogt"),showHome);
router.post("/subscribe",subscribeNewsletter);
router.get('/about',showAboutPage);

module.exports=router;