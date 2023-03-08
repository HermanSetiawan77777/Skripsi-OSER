const express=require('express')
//const { model } = require('../models/ms_users')
const router=express.Router()
const MS_Users= require('../models/users_model')
const envjson = require('dotenv/config')
const bcrypt  = require('bcrypt')
const nodemailer  = require('nodemailer')
const key_rands  = require('random-key')
var jwt = require('jsonwebtoken');
const MS_License= require('../models/portofolio_model')
const multer = require('multer');
const upload = multer({dest: "../license_images/"});

async function  CheckToken (TokenParam){
    let TokenTRUE=await MS_Users.findOne({token:TokenParam})    
    if (!TokenTRUE) {
        return 0
    } else {
      return TokenTRUE._id
    }
}

// insert license
// router.post('/InsertLicense',async(req,res)=>{
//     let cektoken =  await CheckToken(req.headers.token)
//     if (cektoken == 0) {
//         return res.status(400).json({
//             status : res.statusCode,
//             message:'Token FAILED'
//         })}
//     const oserPost = new MS_License({
//         OwnerID:cektoken._id,
//         portofolio:req.body.portofolio,
//         Remarks:req.body.remarks
//     })

//     try {
//         const oser=await oserPost.save()
//         res.json(oser) 
//     } catch (error) {
//         res.status(400).json({message : error})
//     }

// })

// insert license
router.post('/UploadPortofolio', upload.array('uploadedFiles'), async(req,res)=>{
 //   let result = "FAILED";
    let cektoken =  await CheckToken(req.headers.token)
    if (cektoken == 0) {
        return res.status(400).json({
            status : res.statusCode,
            message:'Token FAILED'
        })}

        if (req.files.length>0) {
            req.files.forEach(uploadedFile => {
                //console.log('masuk');
                const moment = require('moment');
                const tempPath = uploadedFile.path;
                const path = require('path');
                const fs = require('fs');
                let newFileName = moment().format('DDMMyyyyHHmmss') + '_' + uploadedFile.originalname;
                const targetPath = path.join(__dirname, "../license_images/" + newFileName);
        
                if (path.extname(uploadedFile.originalname).toLowerCase() === ".png"
                    || path.extname(uploadedFile.originalname).toLowerCase() === ".jpg"
                    || path.extname(uploadedFile.originalname).toLowerCase() === ".jpeg") {
                    fs.rename(tempPath, targetPath, async err => {
                        if (err) {
                            console.log(err);
                            return errorModel;
                        };
        
                        //insert data
                        const oserPost = new MS_License({
                            OwnerID:cektoken,
                            Portofolio:`license_images/${newFileName}`,
                            Remarks:req.body.remarks
                        })
        
                        res.status(200).json({
                            message:newFileName
                        })
                         const oser =await oserPost.save()
                        // result = oser;
                    }
                    );
                } else {
                    fs.unlink(tempPath, err => {
                        if (err) {
                            console.log(err);
                            return errorModel;
                        };
                    });
                }    
            }
            );
            
        } else {
            res.status(400).json("IMG NOT FOUND")
        }

  
 //   res.json(result);
})




router.get('/ViewLicense/:ownerid',async(req,res)=>
            {
                try {
                    const View= await MS_License.find({OwnerID:req.params.ownerid})    
                    const data=[]
                    for (let i = 0; i < View.length; i++) {
                       // console.log(View[i])
                        data.push({
                            "_id":View[i]._id,
                            "OwnerID":View[i].OwnerID,
                            "Portofolio":View[i].Portofolio,
                            "Remarks":View[i].Remarks
                         //   ,"Files": res.download('http://localhost:3003/files/ViewLicense/'+View[i].License)
                        })  
                    }
                    res.status(200).json({
                        status : res.statusCode,
                        projectid:View[0]._id,
                        message : data 
                    })
                } catch (error) {
                    console.log(error)
                    res.status(400).json({
                        status : res.statusCode,
                        message : error
                    })
                }
        })    



module.exports=router