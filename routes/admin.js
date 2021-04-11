const express=require('express');
const router=express.Router();
const {isLoggedIn,isAdmin}=require('../middleware/middleware');
const Blog=require('../models/blog');
const User=require('../models/user');
const Product=require('../models/product')
const setup=require('../core/multer');
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

router.post('/adminsignup',async(req,res,next)=>{
    try {
        const {username,email,password}=req.body;
        const user=new User({
            email:email,
            username:username
        })
        const registeredUser=await User.register(user,password);
        req.flash('success',`User ${registeredUser.username} successfully created`);
        res.redirect('/adminUser');
    } catch (err) {
        req.flash('error',err.message);
        res.redirect('/adminUser');
    }
})

router.delete('/adminUser/:id',(req,res,next)=>{
    User.findByIdAndDelete(req.params.id,(err,user)=>{
        if(err){
            req.flash('error',err);
            res.redirect('/adminUser')
        }
        req.flash('success',`User ${user.username} deleted successfully`);
        res.redirect('/adminUser');
    })
})


router.get('/adminProduct',isLoggedIn,isAdmin,async(req,res,next)=>{
    const products=await Product.find({});
    res.render('admin/product',{products});
})



router.delete('/adminProduct/:id',async(req,res,next)=>{
    Product.findByIdAndDelete(req.params.id,(err,product)=>{
        if(err){
            req.flash('error',err.message);
            res.redirect('/adminProduct')
        }
        req.flash('success',`Product ${product.title} deleted successfully`);
        res.redirect('/adminProduct');
    })
})


module.exports=router;