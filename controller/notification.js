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
       const upload= setup.single('image');
        upload(req,res,function(err){
            if(err){
                res.json({
                    message:error
                });
            }
            const {title,description}=req.body;
            console.log(req.file);
            let file=path.join('/uploads',req.file.filename)
            Blog.create({
                title:title,
                image:file,
                description:description
            }).then(blog=>{
                req.flash('success',`Added ${blog.title} notification Sucessfully`)
                res.redirect('/adminNotification');
            })
            .catch(err=>{
                req.flash('error',err.message)
                res.redirect("/adminNotification");
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
        const upload=setup.single('image');
        upload(req,res,err=>{
            if(err){
                req.flash('error',err.message);
                res.redirect('/adminNotification');
            }
            const {title,description}=req.body;
            let dataRecords;
            if(req.file){
                dataRecords={
                    title:title,
                    description:description,
                    image:path.join('/uploads',req.file.fileName)
                }
            }else{
                dataRecords={
                    title:title,
                    description:description
                }
            }
            Blog.findByIdAndUpdate(req.params.id,dataRecords,function(err,updateBlog){
                if(err)
                {
                    req.flash('error',err.message);
                    res.redirect("/adminNotification");
                } else{
                    req.flash('success',`Updated ${updateBlog.title} successfully `)
                    res.redirect("/adminNotification");
                }
            })
        })
       
    },
    deleteNotification:(req,res)=>{
        Blog.findByIdAndRemove(req.params.id,function(err){
            if(err)
            {
                req.flash('error',err.message)
                res.redirect("/adminNotification");
            }else {
                req.flash('success',`Deleted notification successFully`)
                res.redirect("/adminNotification");
            }
        })
    }
}