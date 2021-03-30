const Product =require('../models/product');
module.exports={
    showHomePage:(req,res)=>{
        res.redirect('/ogt');
    },
    showHome:async(req,res)=>{
        const products=await Product.find({},'title image price').limit(5); 
        res.render('home',{products});
    },
    subscribeNewsletter:(req,res)=>{
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
    },
    showAboutPage:(req,res)=>{
       res.render('about');
    }
}