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


const userRoutes=require('./routes/users');
const aboutRoutes=require('./routes/about')

//Database Setup

const dbUrl=process.env.DB_URL 
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



app.use('/',userRoutes)
app.use('/',aboutRoutes)

app.get(("/"),(req,res)=>{
    res.redirect('/ogt');
});
app.get(("/ogt"),(req,res)=>{
    res.render('home');
});
app.post("/subscribe",(req,res)=>{
    const {email,js}=req.body;
    console.log(req.body);

    const mcData={
        members:[
        {
            email_address:email,
            status:'pending'
        }
      ]
    }

    const mcDataPost= JSON.stringify(mcData);
   
    const api_key=process.env.API_KEY;


    const options={
        url:'https://us7.api.mailchimp.com/3.0/lists/2e70591c02',
        method:'POST',
        headers:{
            Authorization:`auth ${api_key}`
        },
        body:mcDataPost
    }

    if(email){
        request(options,(err,response,body)=>{
            if(err){
                res.json({error: err});
            }else{
                if(js){
                    res.sendStatus(200);
                }else{
                    res.redirect('/ogt');
                } 
            }
        })
    }else{
        res.status(404).send({message:'Failed'})
    }
})


 

 


//Port setup
const port=process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Server started on ${port} port`);
})
