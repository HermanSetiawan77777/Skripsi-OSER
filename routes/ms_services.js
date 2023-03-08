const { response } = require('express');
const express=require('express')
const router=express.Router()
const MS_Services = require('../models/services_model');
const MS_Users = require('../models/users_model');
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

// CREATE
router.post('/InsertServices',upload.array('uploadedFiles'),async(req,res)=>{
    let cektoken =  await CheckToken(req.headers.token)
    if (cektoken == 0) {
        return res.status(400).json({
            status : res.statusCode,
            message:'Token FAILED'
        })
    } else {
        if (req.files.length>0) {
            req.files.forEach(uploadedFile => {
                const moment = require('moment');
                const tempPath = uploadedFile.path;
                const path = require('path');
                const fs = require('fs');
                let newFileName = moment().format('DDMMyyyyHHmmss') + '_' + uploadedFile.originalname;
                const targetPath = path.join(__dirname, "../license_images/" + newFileName);
                if (path.extname(uploadedFile.originalname).toLowerCase() === ".png"
                || path.extname(uploadedFile.originalname).toLowerCase() === ".jpg"
                || path.extname(uploadedFile.originalname).toLowerCase() === ".jpeg")
                fs.rename(tempPath, targetPath, async err => {
                    if (err) {
                        console.log(err);
                        return errorModel;
                    };
                    //insert data
                    const ServicesPost = new MS_Services({
                        OwnerID:cektoken,
                        ServicesName:req.body.servicesname,
                        Category:req.body.category,
                        Duration:req.body.duration,
                        Price:req.body.price,
                        Remarks:req.body.remarks,
                        Image:`license_images/${newFileName}`
                    })
                   // console.log(ServicesPost)
                    const Project=await ServicesPost.save()
                    res.status(200).json(Project)
                })
            })   
        } else {
            const ServicesPost = new MS_Services({
                OwnerID:cektoken,
                ServicesName:req.body.servicesname,
                Category:req.body.category,
                Duration:req.body.duration,
                Price:req.body.price,
                Remarks:req.body.remarks
            })
            const Project=await ServicesPost.save()
            res.status(200).json(Project)
        }
        // try {
        //     const Services=await ServicesPost.save()
        //     res.status(200).json({message:Services}) 
        // } catch (error) {
        //     res.status(400).json({message : error})
        // }
    }



})

//update status
router.post('/UpdateServices/:id', upload.array('uploadedFiles'), async(req,res)=>{
//router.post('/UpdateServices/:id', async(req,res)=>{

    let cektoken =  await CheckToken(req.headers.token)
    if (cektoken == 0 ) {
        return res.status(400).json({
            status : res.statusCode,
            message:'Token FAILED'
        })
    }
    try {
        //let filess = upload.array(req.body.img)
        console.log(upload)
        if (req.files.length>0) {
            req.files.forEach(uploadedFile => {
                const moment = require('moment');
                const tempPath = uploadedFile.path;
                const path = require('path');
                const fs = require('fs');
                let newFileName = moment().format('DDMMyyyyHHmmss') + '_' + uploadedFile.originalname;
                const targetPath = path.join(__dirname, "../license_images/" + newFileName);
                //console.log('steps1')
                if (path.extname(uploadedFile.originalname).toLowerCase() === ".png"
                || path.extname(uploadedFile.originalname).toLowerCase() === ".jpg"
                || path.extname(uploadedFile.originalname).toLowerCase() === ".jpeg")
               // console.log('steps2')
                fs.rename(tempPath, targetPath, async err => {
                    if (err) {
                        console.log(err);
                        return errorModel;
                    };
                   // console.log('steps3')
                    //insert data
                    const ServicesUpdate = await MS_Services.updateOne({_id:req.params.id},{
                        ServicesName:req.body.servicesname,
                        Duration:req.body.duration,
                        Price:req.body.price,
                        Remarks:req.body.remarks,
                        Image:`license_images/${newFileName}`
                    })
                   // const Project=await oserPost.save()
                  //  res.status(200).json(Project)
                })
            })   
        } else {
            const ServicesUpdate = await MS_Services.updateOne({_id:req.params.id},{
                ServicesName:req.body.servicesname,
                Duration:req.body.duration,
                Price:req.body.price,
                Remarks:req.body.remarks
            })
           // const Project=await oserPost.save()
           // res.status(200).json(Project)
        }
   //     res.status(200).json({message:"Updated Sukses"})
       
        res.status(200).json({message:"Update Sukses"})
    } catch (error) {
      res.status(400).json({message:"Update Error"})  
    }
})

router.get('/ViewServicesListbyOwner/:ownerid',async(req,res)=>

{
    // const resPerPage = 10; // results per page
    // const page = req.params.page || 1;  // Page 
    try {
        const View = await MS_Services.find({
            OwnerID:req.params.ownerid
        })
        // .skip((resPerPage * page) - resPerPage)
        // .limit(resPerPage);
            const data=[]
            for (let i = 0; i < View.length; i++) {
                const user= await MS_Users.findOne({_id:View[i].OwnerID})
                let dataname
                if (!user) {
                    dataname='User Not Found'
                } else {
                    dataname=user.username
                }
                data.push({
                    "_id":View[i]._id,
                    "Remarks":View[i].Remarks,
                    "OwnerID":View[i].OwnerID,
                    "OwnerName":dataname,
                    "ServicesName":View[i].ServicesName,
                    "Category":View[i].Category,
                    "Duration":View[i].Duration,
                    "Price":View[i].Price
                })  
            }
            res.status(200).json({
                status : res.statusCode,
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


router.get('/ViewServicesListAll',async(req,res)=>
{
try {
    // const resPerPage = 10; // results per page
    // const page = req.params.page || 1;  // Page 
    const View = await MS_Services.find({
    })
    // .skip((resPerPage * page) - resPerPage)
    // .limit(resPerPage);
        const data=[]
        for (let i = 0; i < View.length; i++) {
            const user= await MS_Users.findOne({_id:View[i].OwnerID})
            let dataname
            if (!user) {
                dataname='User Not Found'
            } else {
                dataname=user.username
            }
            data.push({
                "_id":View[i]._id,
                "Remarks":View[i].Remarks,
                "OwnerID":View[i].OwnerID,
                "OwnerName":dataname,
                "ServicesName":View[i].ServicesName,
                "Category":View[i].Category,
                "Duration":View[i].Duration,
                "Price":View[i].Price
            })  
        }
        res.status(200).json({
            status : res.statusCode,
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


router.get('/ViewServicesDetail/:_id',async(req,res)=>
{
    try {
        const View = await MS_Services.findOne({
            _id:req.params._id
        })
        //console.log(View)
            const data=[]
                const user= await MS_Users.findOne({_id:View.OwnerID})
                let dataname
                if (!user) {
                    dataname='User Not Found'
                } else {
                    dataname=user.username
                }
                data.push({
                    "_id":View._id,
                    "Remarks":View.Remarks,
                    "OwnerID":View.OwnerID,
                    "OwnerName":dataname,
                    "ServicesName":View.ServicesName,
                    "Category":View.Category,
                    "Duration":View.Duration,
                    "Price":View.Price,
                    "Image":View.Image
                })  
            
            res.status(200).json({
                status : res.statusCode,
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

//search
router.get('/searchservices/:servicesname',async(req,res)=>
    {
        // const resPerPage = 10; // results per page
        // const page = req.params.page || 1;  // Page 
         try {
            query = {};
            if (req.params.servicesname !== undefined) {
                query = {
                    ServicesName: new RegExp(req.params.servicesname, 'i')
                };
            }           
            var response = {};
            MS_Services.find(query, function (err, data) {
                if (err) {
                    response = { "error": true, "message": "Error fetching data" };
                } else {
                    response = { "error": false, "message": data };
                }
                
                res.json(response)
            })
            // .skip((resPerPage * page) - resPerPage)
            // .limit(resPerPage);
        } catch (error) {
            console.log(error)
            res.status(400).json({
                status : res.statusCode,
                message : error
            })
        }
        })


router.delete('/DeleteServices/:_id', async(req,res)=>{
    let cektoken =  await CheckToken(req.headers.token)
    if (cektoken == 0 ) {
        return res.status(400).json({
            status : res.statusCode,
            message:'Token FAILED'
        })
    }
    try {
        const Delete = await MS_Services.deleteOne({_id:req.params._id})
        res.status(200).json({message:"Delete Sukses"})
    } catch (error) {
      res.status(400).json({message:"Delete Error"})  
    }
})




module.exports=router
