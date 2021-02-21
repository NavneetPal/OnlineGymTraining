const mongoose=require('mongoose');

var blogSchema=new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    }
},{
    timestamps:true
});

module.exports=mongoose.model("Blog",blogSchema);