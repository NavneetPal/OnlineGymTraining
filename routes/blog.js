const express=require('express');
const router=express.Router();
const {showAllNotification,createForm,createNewNotification,showNotification,editForm,updateNotification,deleteNotification}=require('../controller/notification');

router.get("/",showAllNotification);
router.get("/new",createForm);
router.post("/",createNewNotification);
router.get("/:id",showNotification);
router.get("/:id/edit",editForm);
router.put("/:id",updateNotification);
router.delete("/:id",deleteNotification); 

module.exports=router;