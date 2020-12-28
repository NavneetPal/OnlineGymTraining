const express=require("express");
const app=express();
const session=require('express-session')
const request =require('request');
const bodyParser=require('body-parser');
const path=require('path');
const { v4: uuid}=require('uuid');
var methodOverride = require('method-override');
const mongoose=require('mongoose');
require('dotenv').config()
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');
const MongoStore = require('connect-mongo')(session);


const authRoutes=require('./routes/index');

//Database Setup

const dbUrl=process.env.DB_URL||"mongodb://localhost:27017/ogt" 
//   process.env.DB_URL
mongoose.connect(dbUrl,
{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    useCreateIndex:true
})
.then(()=>{
    console.log("DB Connected..");
})
.catch(err=>{
    console.log("Oh..NO..ERROR");
    console.log(err);
})







//Middleware
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))


const secret=process.env.SECRET || 'thisshouldbeabettersecret!' ;
const store=new MongoStore({
    url:dbUrl,
    secret,
    touchAfter:24*60*60
})

store.on("error",function(e){
    console.log("SESSION STORE ERROR",e);
})

const sessionConfig={
    store,
    secret,
    resave:false, 
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    console.log(req.session)
    res.locals.currentUser=req.user;
    next();
})



app.use('/',authRoutes)




 

 


//Port setup
const port=process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Server started on ${port} port`);
})
