const Blog=require('../models/blog');
const setup=require('../core/multer');
const path=require('path');
module.exports={
    showAllNotification:async(req,res)=>{
        Blog.find({},function(err,blogs){
            if(err)
            {
                console.log("ERRORS");
            }
            else{
                res.render("notifications/index",{blogs:blogs});
            }
        }) 
    },
    createForm:(req,res)=>{
        res.render("notifications/new");
    },
    createNewNotification:(req,res)=>{
       const upload= setup.single('image')
        upload(req,res,function(err){
            if(err){
                res.json({
                    message:error
                });
            }
            const {title,description}=req.body;
            console.log(req.file);
            let file=path.join('uploads',req.file.filename)
            Blog.create({
                title:title,
                image:file,
                description:description
            }).then(blog=>{
                res.redirect('/notifications');
            })
            .catch(err=>{
                res.render("notifications/new");
            })
                
        })
    },
    showNotification:(req,res)=>{
        Blog.findById(req.params.id,function(err,foundBlog){
            if(err){
                res.redirect("/notifications");
            }
            else{
                res.render("notifications/show",{blog:foundBlog});
            } 
        })
    },
    editForm:(req,res)=>{
        Blog.findById(req.params.id,function(err,foundBlog){
            if(err)
            {
                res.redirect("/notifications");
            }else{
                res.render("notifications/edit",{blog:foundBlog});
            }
        })
    },
    updateNotification:(req,res)=>{
        Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
            if(err)
            {
                res.redirect("/notifications");
            } else{
                res.redirect("/notifications/"+req.params.id);
            }
        })
    },
    deleteNotification:(req,res)=>{
        Blog.findByIdAndRemove(req.params.id,function(err){
            if(err)
            {
                res.redirect("/notifications");
            }else {
                res.redirect("/notifications");
            }
        })
    }
}