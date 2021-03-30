const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    title:{
        required:true,
        type:String,
        trim:true
    },
    description:{
        type:[String],
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
    information:[{
        feature:{
            type:String,
            required:false,
        },
        value:{
            type:String,
            required:false
        }
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment',
        required:false
    }]
},{
    timestamps:true
})

module.exports=mongoose.model('Product',productSchema);