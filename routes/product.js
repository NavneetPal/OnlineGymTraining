const express=require('express');
const router=express.Router();

const {showProducts,showProductById,showAddForm,addProduct,showEditForm,editProductById,deleteProductById}=require('../controller/product');
router.get('/addProduct',showAddForm);
router.get('/',showProducts)
router.post('/',addProduct);

router.get('/:id',showProductById);
router.get('/:id/edit',showEditForm);
router.put('/:id',editProductById);
router.delete('/:id',deleteProductById);

module.exports=router;