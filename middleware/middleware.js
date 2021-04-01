module.exports.isLoggedIn=(req,res,next)=>{

    if(!req.isAuthenticated()){
       //here we are storing the url of the user when they are not authenticated so that we can redirect them to these url after they are loggedIn
        req.flash('error','Youmust be logged in First!')
        //we are storing the url in session so that we can accees it 
        req.session.returnTo=req.originalUrl;
        res.redirect('/signin');
    }
    next();
}