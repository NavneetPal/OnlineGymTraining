const express=require("express");
const app=express();
const request =require('request');
const bodyParser=require('body-parser');
const path=require('path');
const { v4: uuid}=require('uuid');
var methodOverride = require('method-override');
require('dotenv').config()

console.log(process.env);


//Middleware
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))

let comments=[
    {
        id:uuid(),
        username:'Todd',
        comment: 'lol taht is so funny'
    },
    {
        id:uuid(),
        username:'Skyler',
        comment: 'I like to go bird watching with my dog'
    },
    {
        id:uuid(),
        username:'navBroite',
        comment: 'Plz,delete your account Todd'
    },
    {
        id:uuid(),
        username:'onlysayswoof',
        comment: 'woof woof woof'
    }
]

app.get('/comments',(req,res)=>{
    res.render("comments/index",{comments});
})
app.get('/comments/new',(req,res)=>{
    res.render("comments/new");
})
app.post('/comments',(req,res)=>{
    const {username,comment}=req.body;
    comments.push({username,comment,id:uuid()});
    res.redirect("/comments");
})
app.get('/comments/:id',(req,res)=>{
    const {id}=req.params;
    const comment=comments.find(c=>c.id==id);
    res.render('comments/show',{comment});
})
app.get('/comments/:id/edit',(req,res)=>{
    const {id}=req.params;
    const comment=comments.find(c=>c.id==id);
     res.render('comments/edit',{comment});
})
app.patch("/comments/:id",(req,res)=>{
    const {id}=req.params;
    const newCommentText=req.body.comment;
   const foundComment=comments.find(c=>c.id===id);
   foundComment.comment=newCommentText;
   res.redirect('/comments');
})
app.delete('/comments/:id',(req,res)=>{
    const {id}=req.params;
    comments=comments.filter(c=>c.id !== id);
    res.redirect('/comments');
})
 


app.get("/",function(req,res){
    res.redirect("/ogt");
})




app.get(("/ogt"),(req,res)=>{
    res.render('home');
});

//Newsletter Route
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


 

 


const port=process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server started on ${port} port`);
})
