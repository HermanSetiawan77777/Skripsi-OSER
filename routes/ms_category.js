const express=require('express')
const router=express.Router()
const MS_Category = require('../models/category_model');

router.get('/ViewCategory',async(req,res)=>
{
    try {
        const ViewCategory= await MS_Category.find({
        })
            res.status(200).json({
                status : res.statusCode,
                message : ViewCategory
            })
  
    } catch (error) {
      res.status(400).json({message:error})  
    }


})




router.post('/InsertCategory',async(req,res)=>{
    const ProjectPost = new MS_Category({
        Name:req.body.name,
    })
    
    try {
        const Project=await ProjectPost.save()
        res.status(200).json(Project) 
    } catch (error) {
        res.status(400).json({message : error})
    }
})



module.exports=router
