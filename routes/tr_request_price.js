const express=require('express');
const MS_Users = require('../models/users_model');
const router=express.Router()
const TR_Request_Price = require('../models/request_price_model');
const MS_Project = require('../models/project_model');
const MS_services = require('../models/services_model');


async function  CheckToken (TokenParam){
    let TokenTRUE=await MS_Users.findOne({token:TokenParam})    
    if (!TokenTRUE) {
        return 0
    } else {
      return TokenTRUE._id;
    }
}

// CREATE
router.post('/InsertRequestPrice',async(req,res)=>{
    let cektoken =  await CheckToken(req.headers.token)
    if (cektoken == 0 ) {
        return res.status(400).json({
            status : res.statusCode,
            message:'Token FAILED'
        })
    }

    let type = await req.body.category;
    if (type=='project') {
      let assgn = await MS_Project.findOne ({_id:req.body.assignmentid})
      const schedulePost =await new TR_Request_Price({
        assignmentid:req.body.assignmentid,
        name:assgn.Name,
        ownerid:assgn.OwnerID,
        userid:cektoken,
        category:req.body.category,
        price:assgn.Price,
        StartPrice:assgn.Price,
        duration:assgn.Duration,
        Image: assgn.Image
    })
     let hasil = schedulePost.save()
     //res.status(200).json(hasil) 
     //console.log(assgn)
    } else {
        let assgn = await MS_services.findOne ({_id:req.body.assignmentid}) 
        const schedulePost =await new TR_Schedule({
            assignmentid:req.body.assignmentid,
            name:assgn.ServicesName,
            ownerid: assgn.OwnerID,
            userid:cektoken,
            category:req.body.category,
            price:assgn.Price,
            StartPrice:assgn.Price,
            duration:assgn.Duration,
            Image: assgn.Image,
        })
        let hasil = schedulePost.save()
        //res.status(200).json(hasil) 
    }

    try {
       // const schedule=await postt.save()
        res.status(200).json({message:"sucess"}) 
    } catch (error) {
        res.status(400).json({message : error})
    }
})



//update status ReqPrice 1
router.post('/AccRequestPrice1/:id', async(req,res)=>{
    let cektoken =  await CheckToken(req.headers.token)
    if (cektoken == 0 ) {
        return res.status(400).json({
            status : res.statusCode,
            message:'Token FAILED'
        })
    }

    try {
        const userUpdate = await TR_Request_Price.updateOne({_id:req.params.id},{
            status:'1'
        })
        res.status(200).json({message:"Update Status Sukses"})
    } catch (error) {
      res.status(400).json({message:error})  
    }
})



//update status ReqPrice2
router.post('/AccRequestPrice2/:id', async(req,res)=>{
    let cektoken =  await CheckToken(req.headers.token)
    if (cektoken == 0 ) {
        return res.status(400).json({
            status : res.statusCode,
            message:'Token FAILED'
        })
    }

    try {
        const userUpdate = await TR_Request_Price.updateOne({_id:req.params.id},{
            status:'2'
        })
        res.status(200).json({message:"Update Status Sukses"})
    } catch (error) {
      res.status(400).json({message:error})  
    }
})





//update status Cancel ReqPrice99
router.post('/CancelReqPrice99/:id', async(req,res)=>{
    let cektoken =  await CheckToken(req.headers.token)
    if (cektoken == 0 ) {
        return res.status(400).json({
            status : res.statusCode,
            message:'Token FAILED'
        })
    }

    try {
        const userUpdate = await TR_Request_Price.updateOne({_id:req.params.id},{
            status:'99'
        })
        res.status(200).json({message:"Update Status Sukses"})
    } catch (error) {
      res.status(400).json({message:error})  
    }
})


//update status Cancel ReqPrice98
router.post('/CancelReqPrice98/:id', async(req,res)=>{
    let cektoken =  await CheckToken(req.headers.token)
    if (cektoken == 0 ) {
        return res.status(400).json({
            status : res.statusCode,
            message:'Token FAILED'
        })
    }

    try {
        const userUpdate = await TR_Request_Price.updateOne({_id:req.params.id},{
            status:'98'
        })
        res.status(200).json({message:"Update Status Sukses"})
    } catch (error) {
      res.status(400).json({message:error})  
    }
})




router.get('/ViewRequestPriceByUserID/:userid',async(req,res)=>
{
    try {
        const view= await TR_Request_Price.find({
            userid:req.params.userid
        })
        const data=[]
        for (let i = 0; i < view.length; i++) {
            var nameaasign='';
            const owners= await MS_Users.findOne({_id:view[i].ownerid})
            const user= await MS_Users.findOne({_id:view[i].userid})

            data.push({
                "_id":view[i]._id,
                "status":view[i].status,
                "AssignmentID":view[i].assignmentid,
                "AssignmentName":view[i].name,
                "OwnerID":view[i].ownerid,
                "OwnerName":owners.username,
                "OwnerEmail":owners.email,
                "UserID":view[i].userid,
                "UserName":user.username,
                "Category":view[i].category,
                "Duration":view[i].duration,
                "Price":view[i].price,
                "StartPrice":view[i].StartPrice,
            })  
        }
        res.status(200).json({
            status : res.statusCode,
            message : data 
        })
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status:res.statusCode,
            message:error})   
    }


})




router.get('/ViewRequestPriceByOwnerID/:userid',async(req,res)=>
{
    try {
        const view= await TR_Request_Price.find({
            ownerid:req.params.userid
        })
        const data=[]
        for (let i = 0; i < view.length; i++) {
            var nameaasign='';
            const owners= await MS_Users.findOne({_id:view[i].ownerid})
            const user= await MS_Users.findOne({_id:view[i].userid})

            data.push({
                "_id":view[i]._id,
                "status":view[i].status,
                "AssignmentID":view[i].assignmentid,
                "AssignmentName":view[i].name,
                "OwnerID":view[i].ownerid,
                "OwnerName":owners.username,
                "OwnerEmail":owners.email,
                "UserID":view[i].userid,
                "UserName":user.username,
                "Category":view[i].category,
                "Duration":view[i].duration,
                "Price":view[i].price,
                "StartPrice":view[i].StartPrice
            })  
        }
        res.status(200).json({
            status : res.statusCode,
            message : data 
        })
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status:res.statusCode,
            message:error})   
    }


})




router.get('/ViewDetailRequestPrice/:_id',async(req,res)=>
{
    try {
        const view= await TR_Request_Price.find({
            _id:req.params._id
        })
        const data=[]
        for (let i = 0; i < view.length; i++) {
            var nameaasign='';
            const owners= await MS_Users.findOne({_id:view[i].ownerid})
            const user= await MS_Users.findOne({_id:view[i].userid})

            data.push({
                "_id":view[i]._id,
                "status":view[i].status,
                "AssignmentID":view[i].assignmentid,
                "AssignmentName":view[i].name,
                "OwnerID":view[i].ownerid,
                "OwnerName":owners.username,
                "OwnerEmail":owners.email,
                "UserID":view[i].userid,
                "UserName":user.username,
                "Category":view[i].category,
                "Duration":view[i].duration,
                "Price":view[i].price,
                "StartPrice":view[i].StartPrice
            })  
        }
        res.status(200).json({
            status : res.statusCode,
            message : data 
        })
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status:res.statusCode,
            message:"error"})   
    }
})



router.post('/NegoRequestPrice/:id', async(req,res)=>{
    let cektoken =  await CheckToken(req.headers.token)
    if (cektoken == 0 ) {
        return res.status(400).json({
            status : res.statusCode,
            message:'Token FAILED'
        })
    }
    try {
        const userUpdate = await TR_Request_Price.updateOne({_id:req.params.id},{
            price:req.body.price  
        })
        res.status(200).json({message:"Update Price Sukses"})
    } catch (error) {
      res.status(400).json({message:error})  
    }
})

module.exports=router