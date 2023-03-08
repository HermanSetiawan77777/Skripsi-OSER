const express=require('express');
const MS_Project = require('../models/project_model');
const MS_services = require('../models/services_model');
const MS_Users = require('../models/users_model');
const router=express.Router()
const TR_Schedule = require('../models/schedule_model');



async function  CheckToken (TokenParam){
    let TokenTRUE=await MS_Users.findOne({token:TokenParam})    
    if (!TokenTRUE) {
        return 0
    } else {
      return TokenTRUE._id;
    }
}


// CREATE
router.post('/InsertSchedule',async(req,res)=>{
    let cektoken =  await CheckToken(req.headers.token)
    if (cektoken == 0 ) {
        return res.status(400).json({
            status : res.statusCode,
            message:'Token FAILED'
        })
    }
    //let assgn
    let type = await req.body.category;
    //console.log(type)
    if (type=='project') {
    //    console.log("if1")
      let assgn = await MS_Project.findOne ({_id:req.body.assignmentid})
      const schedulePost =await new TR_Schedule({
        assignmentid:req.body.assignmentid,
        name:assgn.Name,
        ownerid:assgn.OwnerID,
        userid:cektoken,
        category:req.body.category,
        price:assgn.Price,
        duration:assgn.Duration,
        Image: assgn.Image
    })
     let hasil = schedulePost.save()
     //console.log(assgn)
    } else {
      //  console.log("if2")
        let assgn = await MS_services.findOne ({_id:req.body.assignmentid}) 
        const schedulePost =await new TR_Schedule({
            assignmentid:req.body.assignmentid,
            name:assgn.ServicesName,
            ownerid: assgn.OwnerID,
            userid:cektoken,
            category:req.body.category,
            price:assgn.Price,
            duration:assgn.Duration,
            Image: assgn.Image,
        })
        let hasil = schedulePost.save()
    }
   
    try {
        res.status(200).json({message:"Insert Success"}) 
    } catch (error) {
        res.status(400).json({message : error})
    }
})


router.get('/ViewScheduleDetail/:_id',async(req,res)=>
    {
        try {
            console.log(req.params._id)
            const View = await TR_Schedule.findOne({
                _id:req.params._id
            })
            console.log(View.status)
            //let idid=View._id
            //console.log(View[0]._id)
                const data=[]
                    let  user= await MS_Users.findOne({_id:View.userid})
                    let dataname
                    if (!user) {
                        dataname='User Not Found'
                    } else {
                        dataname=user.username
                    }


                    let  owner= await MS_Users.findOne({_id:View.ownerid})
                    let owname
                    if (!owner) {
                        dataname='User Not Found'
                    } else {
                        owname=owner.username
                    }
                 
                    let statuss
                   // console.log("===========================")
                   // console.log(View)
                    if (View.status==0) {
                        statuss='menunggu konfirmasi'
                    } else  if (View.status==1){
                        statuss="dalam proses"
                    } else  if (View.status==2){
                        statuss="selesai"
                    } else  if (View.status==99){
                        statuss="dibatalkan oleh pemilik"
                    } else  if (View.status==98){
                        statuss="dibatalkan oleh user"
                    }
                   // console.log(statuss)


                   // console.log(View)
                    data.push({
                        "_id":View._id,
                        "OwnerID":owner._id,
                        "OwnerName":owname,
                        "UserID":View.userid,
                        "UserName":dataname,
                        "Category":View.category,
                        "ProjectName":View.name,
                        "Price":View.price,
                        "Duration":View.duration,
                        "Image":View.Image,
                        "StatusNo":View.status,
                        "Status":statuss
                    })  
                
                //console.log(View.status)
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


//update status
router.post('/UpdateScheduleStatus/:id', async(req,res)=>{
    let cektoken =  await CheckToken(req.headers.token)
    if (cektoken == 0 ) {
        return res.status(400).json({
            status : res.statusCode,
            message:'Token FAILED'
        })
    }

    try {
        const userUpdate = await TR_Schedule.updateOne({_id:req.params.id},{
            status:req.body.status
        })
        res.status(200).json({message:"Update Status Sukses"})
    } catch (error) {
      res.status(400).json({message:error})  
    }
})


router.post('/UpdateScheduleReview/:id', async(req,res)=>{
    let cektoken =  await CheckToken(req.headers.token)
    if (cektoken == 0 ) {
        return res.status(400).json({
            status : res.statusCode,
            message:'Token FAILED'
        })
    }

    try {
        const userUpdate = await TR_Schedule.updateOne({_id:req.params.id},{
            review:req.body.review
        })
        res.status(200).json({message:"Update Review Sukses"})
    } catch (error) {
      res.status(400).json({message:error})  
    }
})


// router.post('/UpdateSchedulePrice/:id', async(req,res)=>{
//     let cektoken =  await CheckToken(req.headers.token)
//     if (cektoken == 0 ) {
//         return res.status(400).json({
//             status : res.statusCode,
//             message:'Token FAILED'
//         })
//     }
//     try {
//         const userUpdate = await TR_Schedule.updateOne({_id:req.params.id},{
//             price:req.body.price  
//         })
//         res.status(200).json({message:"Update Price Sukses"})
//     } catch (error) {
//       res.status(400).json({message:error})  
//     }
// })


router.get('/viewSchedulebyUserID/:userid',async(req,res)=>
{
    try {
        const viewSchedule= await TR_Schedule.find({
            userid:req.params.userid
        })
        const data=[]
        for (let i = 0; i < viewSchedule.length; i++) {
            var nameaasign='';
            const owners= await MS_Users.findOne({_id:viewSchedule[i].ownerid})
            const user= await MS_Users.findOne({_id:viewSchedule[i].userid})
            // let categories = viewSchedule[i].category
            // if (categories =='project') {
            //     const cat= await MS_Project.findById(viewSchedule[i].assignmentid)
            // //    console.log('IF1')    
            //     nameaasign=cat.Name;
            // }

            // if (categories =='services') {
            //     const cat= await MS_services.findOne({_id:viewSchedule[i].assignmentid})
            // //    console.log('IF2')  
            //     nameaasign=cat.ServicesName;
            // }


            let statuss
            // console.log("===========================")
            // console.log(View)
             if (viewSchedule[i].status==0) {
                 statuss='menunggu konfirmasi'
             } else  if (viewSchedule[i].status==1){
                 statuss="dalam proses"
             } else  if (viewSchedule[i].status==2){
                 statuss="selesai"
             } else  if (viewSchedule[i].status==99){
                 statuss="dibatalkan oleh pemilik"
             } else  if (viewSchedule[i].status==98){
                 statuss="dibatalkan oleh user"
             }

            data.push({
                "_id":viewSchedule[i]._id,
                "statusNo":viewSchedule[i].status,
                "status":statuss,
                "review":viewSchedule[i].review,
                "AssignmentID":viewSchedule[i].assignmentid,
                "AssignmentName":viewSchedule[i].name,
                "OwnerID":viewSchedule[i].ownerid,
                "OwnerName":owners.username,
                "UserID":viewSchedule[i].userid,
                "UserName":user.username,
                "Category":viewSchedule[i].category,
                "Duration":viewSchedule[i].duration,
                "Price":viewSchedule[i].price,
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


router.get('/ViewScheduleyByAssignment/:assignmentid',async(req,res)=>
{
    try {
        const viewSchedule= await TR_Schedule.find({
            assignmentid:req.params.assignmentid
        })
        const data=[]
        for (let i = 0; i < viewSchedule.length; i++) {
            var nameaasign='';
            

            const owners= await MS_Users.findOne({_id:viewSchedule[i].ownerid})
            const user= await MS_Users.findOne({_id:viewSchedule[i].userid})
            // let categories = viewSchedule[i].category
            // if (categories =='project') {
            //     const cat= await MS_Project.findById(viewSchedule[i].assignmentid)
            // //    console.log('IF1')    
            //     nameaasign=cat.Name;
            // }

            // if (categories =='services') {
            //     const cat= await MS_services.findOne({_id:viewSchedule[i].assignmentid})
            // //    console.log('IF2')  
            //     nameaasign=cat.ServicesName;
            // }

            data.push({
                "_id":viewSchedule[i]._id,
                "status":viewSchedule[i].status,
                "review":viewSchedule[i].review,
                "AssignmentID":viewSchedule[i].assignmentid,
                "AssignmentName":viewSchedule[i].name,
                "OwnerID":viewSchedule[i].ownerid,
                "OwnerName":owners.username,
                "UserID":viewSchedule[i].userid,
                "UserName":user.username,
                "Category":viewSchedule[i].category,
                "Duration":viewSchedule[i].duration,
                "Price":viewSchedule[i].price,
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

router.get('/ViewScheduleyByOwner/:ownerid',async(req,res)=>
{
    try {
        const viewSchedule= await TR_Schedule.find({
            ownerid:req.params.ownerid
        })
        const data=[]
        for (let i = 0; i < viewSchedule.length; i++) {
            var nameaasign='';
            

            const owners= await MS_Users.findOne({_id:viewSchedule[i].ownerid})
            const user= await MS_Users.findOne({_id:viewSchedule[i].userid})
            // let categories = viewSchedule[i].category
            // if (categories =='project') {
            //     const cat= await MS_Project.findById(viewSchedule[i].assignmentid)
            // //    console.log('IF1')    
            //     nameaasign=cat.Name;
            // }

            // if (categories =='services') {
            //     const cat= await MS_services.findOne({_id:viewSchedule[i].assignmentid})
            // //    console.log('IF2')  
            //     nameaasign=cat.ServicesName;
            // }

            let statuss
            // console.log("===========================")
            // console.log(View)
             if (viewSchedule[i].status==0) {
                 statuss='menunggu konfirmasi'
             } else  if (viewSchedule[i].status==1){
                 statuss="dalam proses"
             } else  if (viewSchedule[i].status==2){
                 statuss="selesai"
             } else  if (viewSchedule[i].status==99){
                 statuss="dibatalkan oleh pemilik"
             } else  if (viewSchedule[i].status==98){
                 statuss="dibatalkan oleh user"
             }


            data.push({
                "_id":viewSchedule[i]._id,
                "statusNo":viewSchedule[i].status,
                "Status":statuss,
                "review":viewSchedule[i].review,
                "AssignmentID":viewSchedule[i].assignmentid,
                "AssignmentName":viewSchedule[i].name,
                "OwnerID":viewSchedule[i].ownerid,
                "OwnerName":owners.username,
                "UserID":viewSchedule[i].userid,
                "UserName":user.username,
                "Category":viewSchedule[i].category,
                "Duration":viewSchedule[i].duration,
                "Price":viewSchedule[i].price,
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


module.exports=router
