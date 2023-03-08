const express=require('express')
//const { model } = require('../models/ms_users')
const router=express.Router()
const envjson = require('dotenv/config')
const key_rands  = require('random-key')
var jwt = require('jsonwebtoken');
const MS_License= require('../models/portofolio_model')
const multer = require('multer');
const upload = multer({dest: "../license_images/"});



// exports.getFile = function(req,res){
//     console.log("steps1")
//     res.download('../license_images/'+req.params.path);
// }



router.get('/ViewLicense/:path',async(req,res)=>
    {
        try {
           // console.log("steps1")
            res.download('./license_images/'+req.params.path);
        } catch (error) {
            console.log(error)
            res.status(400).json({
                status : res.statusCode,
                message : error
            })
        }
})    



module.exports=router