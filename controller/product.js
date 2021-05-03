const Product=require('../models/product');
const setup=require('../core/multer');
const path=require('path');

module.exports={
    showProducts:async(req,res)=>{
        if(Object.keys(req.query).length===0){
            const products=await Product.find({});
            res.render('store',{products})
        }else{
            const {minprice,maxprice,productName,sortOrder,rating}=req.query;
            if(minprice && maxprice){
                const products=await Product.find({price:{$gte:minprice,$lte:maxprice}});
                res.render('store',{products})
            }
            if(productName){
                const products=await Product.find({title:new RegExp('.*'+productName+'.*','i')});
                res.render('store',{products});
            }
            if(rating){
                const products=await Product.find({rating:{$gte:rating}});
                res.render('store',{products});
            }
            if(sortOrder){
                if(sortOrder==='highest'){
                    const products=await Product.find({}).sort({price:'desc'});
                    res.render('store',{products});
                  }else{
                    const products=await Product.find({}).sort({price:'asc'});
                    res.render('store',{products});
                  }
            }
        }
       
    },
    showAddForm:(req,res)=>{
        res.render('product/add')
    },
    addProduct:(req,res)=>{
        const upload=setup.single('image');
        upload((req,res,err)=>{

            if(err){
                res.json({
                    message:error
                });
            }
            const {price,title,description}=req.body;
            console.log(req.file);
            let file=path.join('/uploads',req.file.filename)
            Product.create({
                title:title,
                image:file,
                description:description,
                price:price
            }).then(product=>{
                req.flash('success',`Added ${product.title} notification Sucessfully`)
                res.redirect('/adminProduct');
            })
            .catch(err=>{
                req.flash('error',err.message)
                res.redirect("/adminProduct");
            })
        })
    },
    showProductById:async(req,res)=>{
        const id=req.params.id;
        const products=await Product.find({},'title image price').limit(5);
        Product.findById(id).populate('comments')
        .then(product=>{
            res.render('product/showProduct',{product,products});
        })
        .catch(err=>{
            res.render('store');
        })
    },
    showEditForm:(req,res)=>{
        Product.findById(req,params.id,(err,foundProduct)=>{
            if(err){
                res.redirect('/products')
            }
           res.render('product/edit',{product:foundProduct});
        })
    },
    editProductById:(req,res)=>{
        Product.findByIdAndUpdate(req.params.id,req.body,(err,product)=>{
            if(err){
                res.redirect('/products');
            }
            res.redirect(`/products/${req.params.id}`)
        })
    },
    deleteProductById:(req,res)=>{
        Product.findByIdAndRemove(req.params.id,(err,data)=>{
            if(err){
                res.redirect('/products');
            }else{
                res.redirect('/products');
            }
        })
    }
}