const express=require('express');
const router=express.Router();
const User=require('../models/user');
const {showHomePage,showHome,subscribeNewsletter,showAboutPage}=require('../controller/index');
const {showProducts}=require('../controller/product');

router.get(("/"),showHomePage);
router.get(("/ogt"),showHome);
router.post("/subscribe",subscribeNewsletter);
router.get('/about',showAboutPage);
router.get('/store',showProducts);

module.exports=router;