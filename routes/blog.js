const express=require('express');
const router=express.Router();
const Blog=require('../models/blog');
const mongoose=require('mongoose');

//RESTFUL ROUTES


//INDEX:The routes that will list all the blogs that we are having" "/blogs"
router.get("/",function(req,res){
     Blog.find({},function(err,blogs){
        if(err)
        {
            console.log("ERRORS");
        }
        else{
            res.render("blogs/index",{blogs:blogs});
        }
    }) 
})


//For creating a blog on our own
/* router.get('/create',(req,res)=>{
      Blog.create({
          title:"The Full Stack Development",
          image:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1052&q=80",
          description:"Now, a Full Stack Developer is a software expert who's equally proficient in frontend (client-side) development and backend (server-side) development. Full Stack Developers are familiar with each layer of tech stacks that go into the making of a software product."
      }).then(blog=>{
          res.redirect('/blogs');
      })
      .catch(err=>{
          console.log(err);
      }) 
     
  }) */

//NEW ROUTE :This will give us the form to create a new Blog and will rrender to that page
router.get("/new",function(req,res){
    res.render("blogs/new")
})

//CREATE ROUTE :This will create the blog in the dtabase when we submit information to the form and click submit the form
router.post("/",function(req,res){
    const {title,image,description}=req.body;
     Blog.create({
         title:title,
         image:image,
         description:description
     }).then(blog=>{
         res.redirect('/blogs');
     })
     .catch(err=>{
         res.render("blogs/new");
     })
    
})


//SHOW ROUTE
router.get("/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("blogs/show",{blog:foundBlog});
        } 
    })  
});




//EDIT ROUTE
router.get("/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        {
            res.redirect("/blogs");
        }else{
            res.render("blogs/edit",{blog:foundBlog});
        }
    })
})



//UPDATE ROUTE
router.put("/:id",function(req,res){

    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
        if(err)
        {
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
})


//DELETE ROUTE
router.delete("/:id",function(req,res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err)
        {
            res.redirect("/blogs");
        }else {
            res.redirect("/blogs");
        }
    })
    //redirect somewhere
}); 



module.exports=router;