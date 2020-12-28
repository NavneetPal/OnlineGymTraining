module.exports.isLoggedIn=(req,res,next)=>{

    if(!req.isAuthenticated()){
    //store the url they are requesting
        req.session.returnTo=req.originalUrl;
        res.redirect('/signin');
    }
    next();
}