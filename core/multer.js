const multer=require('multer');
const path=require('path');
const fs=require('fs');

//You are specifying the destination folder where you want to store the images and the filename
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let dir=path.join(__dirname,'..','uploads');
      if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }
      cb(null, dir)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'-'+ file.originalname)
    }
  })


  
  module.exports=multer({storage:storage});