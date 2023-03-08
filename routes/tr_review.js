const express=require('express')
const router=express.Router()
const TR_Review = require('../models/review_model');
const MS_Users = require('../models/users_model')



async function  CheckToken (TokenParam){
    let TokenTRUE=await MS_Users.findOne({token:TokenParam})    
    if (!TokenTRUE) {
        return 0
    } else {
      return TokenTRUE._id;
    }
}

router.get('/ViewReviewyByAssignment/:assignmentid',async(req,res)=>
{
    try {
        const View= await TR_Review.find({
            AssignmentID:req.params.assignmentid
        })

        const data=[]
        for (let i = 0; i < View.length; i++) {
            const user= await MS_Users.findOne({_id:View[i].OwnerID})
            const user2= await MS_Users.findOne({_id:View[i].UserID})
            let dataname
            let dataname2

            if (!user) {
                dataname='User Not Found'
            } else {
                dataname=user.username
            }

            if (!user2) {
                dataname2='User Not Found'
            } else {
                dataname2=user2.username
            }
            data.push({
                "_id":View[i]._id,
                "AssignmentID":View[i].AssignmentID,
                "OwnerID":View[i].OwnerID,
                "OwnerName":dataname,
                "Userid":View[i].UserID,
                "UserName":dataname2,
                "Review":View[i].Review,
                "Rate":View[i].Rate,
                "Category":View[i].Category
            })  
        }
            res.status(200).json({
                status : res.statusCode,
                message : data
            })   
    } catch (error) {
      res.status(400).json({message:error})  
    }


})

router.get('/ViewReviewyByOwner/:ownerid',async(req,res)=>
{
    try {
        const View= await TR_Review.find({
            OwnerID:req.params.ownerid
        })

        const data=[]
        for (let i = 0; i < View.length; i++) {
            const user= await MS_Users.findOne({_id:View[i].OwnerID})
            const user2= await MS_Users.findOne({_id:View[i].UserID})
            let dataname
            let dataname2

            if (!user) {
                dataname='User Not Found'
            } else {
                dataname=user.username
            }

            if (!user2) {
                dataname2='User Not Found'
            } else {
                dataname2=user2.username
            }
            data.push({
                "_id":View[i]._id,
                "AssignmentID":View[i].AssignmentID,
                "OwnerID":View[i].OwnerID,
                "OwnerName":dataname,
                "Userid":View[i].UserID,
                "UserName":dataname2,
                "Review":View[i].Review,
                "Rate":View[i].Rate,
                "Category":View[i].Category
            })  
        }


            res.status(200).json({
                status : res.statusCode,
                message : data
            })
        
    } catch (error) {
        res.status(400).json({message:error})
    }


})

router.post('/InsertReview',async(req,res)=>{

    let cektoken =  await CheckToken(req.headers.token)
    if (cektoken == 0 ) {
        return res.status(400).json({
            status : res.statusCode,
            message:'Token FAILED'
        })
    }

    const ReviewPostectPost = new TR_Review({
        AssignmentID:req.body.assignmentid,
        OwnerID:cektoken,
        UserID:req.body.userid,
        Review:req.body.review,
        Rate:req.body.rate,
        Category:req.body.category
    })
    try {
        const inserts=await ReviewPostectPost.save()
        res.status(200).json(ReviewPostectPost) 
    } catch (error) {
        res.status(400).json({message : error})
    }
})



module.exports=router
