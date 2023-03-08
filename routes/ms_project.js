const express=require('express')
const router=express.Router()
const MS_Project = require('../models/project_model');
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
router.post('/InsertProject', upload.array('uploadedFiles'),async(req,res)=>{
    let cektoken =  await CheckToken(req.headers.token)
    if (cektoken == 0) {
        return res.status(400).json({
            status : res.statusCode,
            message:'Token FAILED'
        })
    }else {
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
                    const oserPost = new MS_Project({
                        OwnerID:cektoken,
                        Image:`license_images/${newFileName}`,
                        Category:req.body.category,
                        Name:req.body.name,
                        Price:req.body.price,
                        Deadline:req.body.deadline,
                        Duration:req.body.duration,
                        Remarks:req.body.remarks
                    })
                    const Project=await oserPost.save()
                    res.status(200).json(Project)
                })
            })   
        } else {
            const oserPost = new MS_Project({
                OwnerID:cektoken,
                Category:req.body.category,
                Name:req.body.name,
                Price:req.body.price,
                Deadline:req.body.deadline,
                Duration:req.body.duration,
                Remarks:req.body.remarks
            })
            const Project=await oserPost.save()
            res.status(200).json(Project)
        }
        
    }
})

//update status
router.post('/UpdateProject/:id', upload.array('uploadedFiles'), async(req,res)=>{
    try {

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
                    const oserPost = await MS_Project.updateOne({_id:req.params.id},{
                        Name:req.body.name,
                        Price:req.body.price,
                        Deadline:req.body.deadline,
                        Duration:req.body.duration,
                        Remarks:req.body.remarks,
                        Image:`license_images/${newFileName}`,
                    })
                   // const Project=await oserPost.save()
                  //  res.status(200).json(Project)
                })
            })   
        } else {
            const oserPost = await MS_Project.updateOne({_id:req.params.id},{
                Name:req.body.name,
                Price:req.body.price,
                Deadline:req.body.deadline,
                Duration:req.body.duration,
                Remarks:req.body.remarks
            })
           // const Project=await oserPost.save()
           // res.status(200).json(Project)
        }
        res.status(200).json({message:"Updated Sukses"})
    } catch (error) {
      res.status(400).json({message:error})  
    }
})

//cek error
router.get('/ViewProjectAll',async(req,res)=>
{
//  const resPerPage = 10; // results per page
//  const page = req.params.page || 1;  // Page 
    try {
        const View = await MS_Project.find({
         }) 
        //  .skip((resPerPage * page) - resPerPage)
        //  .limit(resPerPage);
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
                    "OwnerID":View[i].OwnerID,
                    "OwnerName":dataname,
                    "Category":View[i].Category,
                    "ProjectName":View[i].Name,
                    "Price":View[i].Price,
                    "Deadline":View[i].Deadline,
                    "Duration":View[i].Duration,
                    "Remarks":View[i].Remarks
                    //,"Image":View[i].Image
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

router.get('/ViewProjectByOwner/:ownerid',async(req,res)=>
    {
        // const resPerPage = 10; // results per page
        // const page = req.params.page || 1;  // Page 
        try {
            const View = await MS_Project.find({
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
                        "OwnerID":View[i].OwnerID,
                        "OwnerName":dataname,
                        "Category":View[i].Category,
                        "ProjectName":View[i].Name,
                        "Price":View[i].Price,
                        "Deadline":View[i].Deadline,
                        "Duration":View[i].Duration,
                        "Remarks":View[i].Remarks
                        //,"Image":View[i].Image
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




router.get('/ViewProjectDetail/:_id',async(req,res)=>
    {
        try {
            const View = await MS_Project.find({
                _id:req.params._id
            })
            //let idid=View._id
            //console.log(View[0]._id)
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
                        "OwnerID":View[i].OwnerID,
                        "OwnerName":dataname,
                        "Category":View[i].Category,
                        "ProjectName":View[i].Name,
                        "Price":View[i].Price,
                        "Deadline":View[i].Deadline,
                        "Duration":View[i].Duration,
                        "Remarks":View[i].Remarks,
                        "Image":View[i].Image
                    })  
                }
                res.status(200).json({
                    status : res.statusCode,
                    //projectid:View[0]._id,
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


router.get('/searchproject/:projname/',async(req,res)=>
    {
        // const resPerPage = 10; // results per page
        // const page = req.params.page || 1;  // Page 
         try {
            query = {};
            if (req.params.projname !== undefined) {
                query = {
                    Name: new RegExp(req.params.projname, 'i')
                };
            }
            
            var response = {};
            MS_Project.find(query, function (err, data) {
                if (err) {
                    response = { "error": true, "message": "Error fetching data" };
                } else {
                    response = { "error": false, "message": data }
                }
                res.json(response);
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




router.delete('/DeleteProject/:id', async(req,res)=>{

    try {
        const ProjectDelete = await MS_Project.deleteOne({_id:req.params.id})
        res.status(200).json({message:"Delete Sukses"})
    } catch (error) {
      res.status(400).json({message:"Delete Error"})  
    }
})

module.exports=router
