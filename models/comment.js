const mongoose=require('mongoose');

const commentSchema=new mongoose.Schema({
  text:{
      type:String,
      required:true,
      trim:true
  },
  rating:{
    type:Number
  },
  author:{
      id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User"
      },
      username:String
  }
})

module.exports=mongoose.model('Comment',commentSchema);