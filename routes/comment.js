const express=require('express');
const router=express.Router({mergeParams:true});
const Product=require('../models/product');
const Comment=require('../models/comment');
const {isLoggedIn}=require('../middleware/middleware');

router.post('/',isLoggedIn,async(req,res)=>{
    const product=await Product.findById(req.params.id);
    console.log(product);
    if(product){
        const comment= await Comment.create(req.body);
        comment.author.id=req.user._id;
        comment.author.username=req.user.username;
        //save comment
        const newComment= await comment.save();
        product.comments.push(newComment);
        const newProduct=await product.save();
        console.log(newProduct);
        res.redirect(`/product/${newProduct._id}`);
    }
})

module.exports=router