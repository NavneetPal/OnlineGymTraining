const express=require('express');
const router=express.Router();
const path=require('path');
const User=require('../models/user');
const Product=require('../models/product');
const Trainer=require('../models/trainer');
const Cart=require('../models/cart');
const {isLoggedIn}=require('../middleware/middleware');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {showHomePage,showHome,subscribeNewsletter,showAboutPage}=require('../controller/index');
const {showProducts}=require('../controller/product');
const { reset } = require('chalk');

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
router.get('/cart',isLoggedIn,(req,res)=>{
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

const YOUR_DOMAIN=process.env.DOMAIN

router.post('/create-checkout-session',async (req, res) => {
    let cart=new Cart(req.session.cart);
    let products=cart.generateArray();
    let cartProducts=[];
    
    //TODO:here we are not able to add images giving error if got time then we have to correct it
    for(let product of products){
      const image=path.join(`${YOUR_DOMAIN}`,product.item.image);
      let eachProduct= {
        price_data: {
          currency: 'inr',
          product_data: {
            name: `${product.item.title}`
          },
          unit_amount: product.item.price*100,
        },
        quantity: product.qty,
      }
      cartProducts.push(eachProduct);
    }

    let line_items=cartProducts;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    });
  
    res.json({ id: session.id });
});


router.get('/success',(req,res)=>{
  req.session.cart=null;
  res.render('success');
});

router.get('/cancel',(req,res)=>{
  res.redirect('/cart');
})

router.get('/trainer/:id',async(req,res)=>{
  const trainer=await Trainer.findById(req.params.id);
  res.render('trainer',{trainer});
})





module.exports=router;