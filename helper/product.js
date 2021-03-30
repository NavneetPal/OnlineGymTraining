const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    title:{
        required:true,
        type:String,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true,
        maxlength:3000
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
    },
    sold:{
        type:Number,
        default:0
    },
    information:{
        brand:{
            type:String,
            required:true
        },
        manufacturer:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        }
    }
},{
    timestamps:true
})

module.exports=mongoose.model('Product',productSchema);