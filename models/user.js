const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose')


const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        trim:true
    }
})
//It will add the username,hash and salt field to store the username,the hashed password and the salt value
UserSchema.plugin(passportLocalMongoose)

module.exports=mongoose.model('User',UserSchema);