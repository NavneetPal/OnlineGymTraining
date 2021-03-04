const express=require('express');
const router=express.Router();

const {showProduct}=require('../controller/product');
router.get('/',showProduct);

module.exports=router;