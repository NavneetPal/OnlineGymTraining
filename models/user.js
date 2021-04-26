const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose')
const Schema=mongoose.Schema;

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
        trim:true,
        unique:true
    },
    role:{
        type:Number,
        required:false,
        default:0
    },
    googleId:{
        type:String
    },
    facebookId:{
        type:String
    },
    purchases:[{
        type:Schema.Types.ObjectId,
        ref:'Order',
        required:false
    }]
})

UserSchema.statics.checkExistingField = function(field, value){
    return this.findOne({ [`${field}`]: value });
};
//It will add the username,hash and salt field to store the username,the hashed password and the salt value
UserSchema.plugin(passportLocalMongoose)

module.exports=mongoose.model('User',UserSchema);