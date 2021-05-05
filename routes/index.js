const express=require('express');
const router=express.Router();
const path=require('path');
const User=require('../models/user');
const Product=require('../models/product');
const Trainer=require('../models/trainer');
const Cart=require('../models/cart');
const Order=require('../models/order');
const {isLoggedIn}=require('../middleware/middleware');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {showHomePage,showHome,subscribeNewsletter,showAboutPage}=require('../controller/index');
const {showProducts}=require('../controller/product');
const chalk = require('chalk');

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
router.get('/cart',isLoggedIn,async(req,res)=>{
    if(!req.session.cart){
        return res.render('checkout',{products:null});
    }
    let cart=new Cart(req.session.cart);
    const user=await User.findById(req.user.id);
    res.render('checkout',{products:cart.generateArray(),totalPrice:cart.totalPrice,user:user});
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


router.get('/success',async(req,res)=>{
  let cart=new Cart(req.session.cart);
  let products=cart.generateArray();

  for(let product of products){
    let newQty=product.item.quantity-product.qty;
    await Product.findByIdAndUpdate(product.item._id,{quantity:newQty});
  }

  const order=new Order({
    user:req.user,
    cart:products
  })
  const newOrder=await order.save();
  if(order){
    const user=await User.findById(req.user._id);
    user['purchases'].push(order);
    const newUser=await user.save();
  }
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


router.get('/user',async(req,res)=>{
  
  const user=await User.findById(req.user.id).populate('purchases');
  console.log(user);
  const purchases=user['purchases'];
  res.render('user',{user});
})


router.post('/updateUser/:id',async(req,res)=>{
  console.log(req.body);
  const updatedUser=await User.findByIdAndUpdate({_id:req.params.id},req.body);
  if(updatedUser){
    req.flash('success','Your Profile updated Successfully');
    res.redirect('/user');
  }else{
    req.flash('error','Not able to Update.');
    res.redirect('/user');
  }
})



router.get('/class/:id',(req,res)=>{
  const id=req.params.id;
  if(id==='1'){
    res.render('class1');
  }
  res.render('class');
})




module.exports=router;