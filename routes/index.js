const express=require('express');
const router=express.Router();
const User=require('../models/user');
const Product=require('../models/product');
const Cart=require('../models/cart')
const {showHomePage,showHome,subscribeNewsletter,showAboutPage}=require('../controller/index');
const {showProducts}=require('../controller/product');

router.get(("/"),showHomePage);
router.get(("/ogt"),showHome);
router.post("/subscribe",subscribeNewsletter);
router.get('/about',showAboutPage);
router.get('/store',showProducts);
router.get('/addtocart/:id',(req,res)=>{
     const productId=req.params.id;
     let cart=new Cart(req.session.cart? req.session.cart:{items:{}});

     Product.findById(productId,(err,product)=>{
         if(err){
             return res.redirect('/store');
         }
         cart.add(product,product.id)
         req.session.cart=cart;
         console.log(req.session.cart);
         res.redirect('/product/'+productId);
     })
})
router.get('/cart',(req,res)=>{
    if(!req.session.cart){
        return res.render('checkout',{products:null});
    }
    let cart=new Cart(req.session.cart);
    res.render('checkout',{products:cart.generateArray(),totalPrice:cart.totalPrice});
})

router.get('/reduce/:id',(req,res)=>{
    const productId=req.params.id;
    const cart=new Cart(req.session.cart? req.session.cart:{});

    cart.reduceByOne(productId);
    req.session.cart=cart;
    res.redirect('/cart');
})

router.get('/increase/:id',(req,res)=>{
    const productId=req.params.id;
    const cart=new Cart(req.session.cart? req.session.cart:{});

    cart.increaseByOne(productId);
    req.session.cart=cart;
    res.redirect('/cart');
})



module.exports=router;