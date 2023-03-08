const express=require('express')
const router=express.Router()
const MS_Chat = require('../models/chat_model');
const MS_Users = require('../models/users_model');


async function  CheckToken (TokenParam){
    let TokenTRUE=await MS_Users.findOne({token:TokenParam})    
    if (!TokenTRUE) {
        return 0
    } else {
      return TokenTRUE._id
    }
}


// CREATE
router.post('/OwnerChat',async(req,res)=>{
    let cektoken =  await CheckToken(req.headers.token)
    if (cektoken == 0) {
        return res.status(400).json({
            status : res.statusCode,
            message:'Token FAILED'
        })
    }else {
        const ins = new MS_Chat({
            AssignmentID:req.body.assignmentid,
            OwnerID:cektoken._id,
            UserID:req.body.userid,
            OwnerChat:req.body.ownerchat,
            Category:req.body.category
        })
        try {
            const Project=await ins.save()
            res.status(200).json(Project) 
        } catch (error) {
            res.status(400).json({message : error})
        }
    }
})


router.post('/UserChat',async(req,res)=>{
    let cektoken =  await CheckToken(req.headers.token)
    if (cektoken == 0) {
        return res.status(400).json({
            status : res.statusCode,
            message:'Token FAILED'
        })
    }else {
        const ins = new MS_Chat({
            AssignmentID:req.body.assignmentid,
            OwnerID:req.body.ownerid,
            UserID:cektoken._id,
            UserChat:req.body.userchat,
            Category:req.body.category
        })
        try {
            const Project=await ins.save()
            res.status(200).json(Project) 
        } catch (error) {
            res.status(400).json({message : error})
        }
    }
})

router.get('/ViewChatAssignment/:assignmentid',async(req,res)=>
    {
        // const resPerPage = 10; // results per page
        // const page = req.params.page || 1;  // Page 
        try {
            const View = await MS_Chat.find({
                AssignmentID:req.params.assignmentid
            })
            // .skip((resPerPage * page) - resPerPage)
            // .limit(resPerPage);
                const data=[]
                for (let i = 0; i < View.length; i++) {
                    const user= await MS_Users.findOne({_id:View[i].UserID})
                    let userdataname
                    if (!user) {
                        userdataname='User Not Found'
                    } else {
                        userdataname=user.username
                    }


                    const owner= await MS_Users.findOne({_id:View[i].OwnerID})
                    let ownerdataname
                    if (!user) {
                        ownerdataname='User Not Found'
                    } else {
                        ownerdataname=user.username
                    }
    
                    data.push({
                        "OwnerID":View[i].OwnerID,
                        "OwnerName":ownerdataname,
                        "UserID":View[i].UserID,
                        "UserName":userdataname,
                        "OwnerChat":View[i].OwnerChat,
                        "UserChat":View[i].UserChat,
                        "Category":View[i].Category
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
            console.log(View[0]._id)
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


router.get('/searchproject/:projname/:page',async(req,res)=>
    {
        const resPerPage = 10; // results per page
        const page = req.params.page || 1;  // Page 
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
            .skip((resPerPage * page) - resPerPage)
            .limit(resPerPage);
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
