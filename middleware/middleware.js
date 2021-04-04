module.exports={
    isLoggedIn:(req,res,next)=>{
       //passport adds the isAuthenticated() method to the request object
        if(!req.isAuthenticated()){
           //here we are storing the url of the user when they are not authenticated so that we can redirect them to these url after they are loggedIn
            req.flash('error','You must be logged in First!')
            //we are storing the url in session so that we can accees it 
            req.session.returnTo=req.originalUrl;
            res.redirect('/signin');
        }
        next();
    },
    isAdmin:(req,res,next)=>{
        if(req.user.role===0){
            req.flash('error','You are not admin only admin can acces that page');
            res.redirect('/signin');
        }else{
            next();
        }
    }
}