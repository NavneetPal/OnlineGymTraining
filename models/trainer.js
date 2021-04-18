const mongoose=require('mongoose');

const trainerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    field:{
        type:String
    },
    image:{
        type:String,
        required:true
    },
    email:{
        type:String,
        trim:true
    },
    phone:{
        type:String
    },
    experience:{
        type:Number,
        required:true
    }
},{
    timestamps:true
})

module.exports=mongoose.model('Trainer',trainerSchema);