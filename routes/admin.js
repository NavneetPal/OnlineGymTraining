const express=require('express');
const router=express.Router();
const {isLoggedIn,isAdmin}=require('../middleware/middleware');
const Blog=require('../models/blog');
const User=require('../models/user');
const Product=require('../models/product')
router.get('/admin',isLoggedIn,isAdmin,(req,res)=>{
    res.redirect('/dashboard')
})
router.get('/dashboard',isLoggedIn,isAdmin,async(req,res)=>{
    const users=await User.find({});
    const products=await Product.find({});
    const notifications=await Blog.find({});
    res.render('admin/dashboard',{users,products,notifications})
})
router.get('/adminNotification',isLoggedIn,isAdmin,async(req,res,next)=>{
    const notifications=await Blog.find({});
    res.render('admin/notification',{notifications});
})

router.get('/adminUser',isLoggedIn,isAdmin,async(req,res,next)=>{
    const users=await User.find({});
    res.render('admin/user',{users});
})



module.exports=router;