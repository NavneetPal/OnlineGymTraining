require('dotenv').config()
const express=require("express");
const app=express();
const session=require('express-session')
const request =require('request');
const bodyParser=require('body-parser');
const path=require('path');
const { v4: uuid}=require('uuid');
var methodOverride = require('method-override');
const mongoose=require('mongoose');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');
const MongoStore = require('connect-mongo')(session);
const fp=require('find-free-port');
const Confirm=require('prompt-confirm');
const chalk=require('chalk');
const flash=require('connect-flash');
const mongoSanitize=require('express-mongo-sanitize')


 
//requiring routes
const indexRoutes=require('./routes/index');
const blogRoutes=require('./routes/blog');
const productRoutes=require('./routes/product');
const authRoutes=require('./routes/auth');
const commentRoutes=require('./routes/comment');
const adminRoutes=require('./routes/admin')
const googleRoutes=require('./routes/google')


//google passport config
require('./core/passport-google')(passport)
require('./core/passport-facebook')(passport)


//Database Connection Setup
var dbUrl="mongodb://localhost:27017/ogt" 
if(process.env.NODE_ENV="production"){
    dbUrl=process.env.DB_URL;
}
mongoose.connect(dbUrl,
{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    useCreateIndex:true
})
.then((conn)=>{
    console.log(chalk.yellow(`DB Connected Properly: ${conn.connection.host}`));
})
.catch(err=>{
    console.log("Oh..NO..ERROR");
    console.log(err);
})

//Middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/uploads',express.static('uploads'));


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(methodOverride('_method'))
app.use(mongoSanitize());



const secret=process.env.SECRET || 'thisshouldbeabettersecret!' ;
const store=new MongoStore({
    url:dbUrl,
    secret,
    touchAfter:24*60*60
})
store.on("error",function(e){
    console.log("SESSION STORE ERROR",e);
})


//PASSPORT CONFIGURATION
const sessionConfig={
    store,
    secret,
    resave:false, 
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
         //secure:true ,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))

//with the flash middleware in place all request will have a  req.flash() function that can
//be used for flash messages
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())

//User.authenticate(),User.serializeUser() and User.deserializeUser() are static methods provided by passport-local-mongoose 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //Genearates a function that is used by passport to serialize user into session
passport.deserializeUser(User.deserializeUser()); //Generates a function that is used by passport to deserialize user into session




app.use((req,res,next)=>{
  
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next();
})




//Main routes Handling
app.use('/notifications',blogRoutes);
app.use('/product',productRoutes);
app.use('/product/:id/comments',commentRoutes);
app.use('/',indexRoutes)
app.use('/',authRoutes)
app.use('/',adminRoutes)
app.use('/auth',googleRoutes)




//Error Handling
app.use((err,req,res,next)=>{
      console.log(err);
})



//server setup
let PORT=parseInt(process.env.PORT) || 8080;
listenServer();
process.on('uncaughtException', (error) => {
    if (error.code === 'EADDRINUSE') {
        fp(PORT).then(([freep]) => {
            new Confirm(`Port no ${PORT} is busy.Do you want to run it on the avalibale port (${freep})?`)
            .run()
            .then(answer=>{
                if(answer){
                    PORT=parseInt(freep); 
                    listenServer();
                }
            })
        })
    }
})  

function listenServer(){
    app.listen(PORT,()=>{
        console.log(chalk.yellow(`server is listenining on port ${PORT}`));
    }) 
}






