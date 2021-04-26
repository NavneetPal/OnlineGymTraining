const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const orderSchema=new mongoose.Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    cart:{
        type:Object,
        required:true
    }
});

module.exports=mongoose.model('Order',orderSchema);