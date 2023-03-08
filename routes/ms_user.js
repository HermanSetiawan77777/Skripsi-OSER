const express=require('express')
const router=express.Router()
const MS_Users= require('../models/users_model')
const envjson = require('dotenv/config')
const bcrypt  = require('bcrypt')
const nodemailer  = require('nodemailer')
const key_rands  = require('random-key')
var jwt = require('jsonwebtoken');


async function  CheckToken (TokenParam){
    let TokenTRUE=await MS_Users.findOne({token:TokenParam})    
    if (!TokenTRUE) {
        return 0
    } else {
      return TokenTRUE._id
    }
}


router.post('/SendEmail', async(req,res)=>{
 
    const keyrand = key_rands.generateBase30(5)

    const transport = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user :'kerja.oser@gmail.com',
            pass :'heycoajfvpfdjiif'
        }
    })
  
    const mailoption = {
        from :'Pencarian Kerja OSER ',
        to : req.body.sendto,
        subject : 'Verification Register Account OSER',
        text : 'VERIFICATION CODE : '+keyrand,
    };
    transport.sendMail(mailoption,(err, info)=>{
        if (err) {
            res.status(400).json({
                message:'Send Verification FALSE'
            })
        } 
        res.status(200).json({
            message:keyrand
        })
    })
})





//Forget PW
router.post('/ForgetPW/:emailss', async(req,res)=>{
 
    const keyrand = key_rands.generateBase30(5)

    const transport = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user :'kerja.oser@gmail.com',
            pass :'heycoajfvpfdjiif'
        }
    })
  
    const mailoption = {
        from :'Pencarian Kerja OSER ',
        to : req.params.emailss,
        subject : 'Verification Register Account OSER',
        text : 'VERIFICATION CODE : OSER'+keyrand,
    };

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync("OSER"+keyrand, salt);

    const ForgetUser = await MS_Users.updateOne({email:req.params.emailss},{
        password:hash
    }  
        )
    transport.sendMail(mailoption,(err, info)=>{
        if (err) {
            res.status(400).json({
                message:'Send Verification FALSE'
            })
        } 
        res.status(200).json({
            message:"OSER"+keyrand
        })
    })
})



//view profile others
router.get('/ViewProfiles/:_id',async(req,res)=>
{
    try {
            let data=[]
                const user= await MS_Users.findOne({_id:req.params._id})
                let dataname
                if (!user) {
                    res.status(200).json({
                        status : res.statusCode,
                        message : "Not FOund" 
                    })
                } else {
                    // data.push({
                    //     "_id":user._id,
                    //     "Username":user.username,
                    //     "Email":user.email,
                    //     "Phone":user.phone,
                    //     "ProjectCompleted":user.ProjectCompleted,
                    //     "ServicesCompleted":user.ServicesCompleted,
                    //     "JoinDate":user.createdDate
                    // })  
                    
                    // user
                    res.status(200).json({
                        status : res.statusCode,
                        message : user 
                    })
                }
                // data.push({
                //     "_id":user._id,
                //     "Username":user.username,
                //     "Email":user.email,
                //     "Phone":user.phone,
                //     "ProjectCompleted":user.ProjectCompleted,
                //     "ServicesCompleted":user.ServicesCompleted,
                //     "JoinDate":user.createdDate
                // })  
            
            
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status : res.statusCode,
            message : error
        })
    }
    })



// CREATE
router.post('/register',async(req,res)=>{
    const tokens = jwt.sign({ id: MS_Users.userid,createdate :MS_Users.createdDate }, process.env.TOKEN_SECRET);
    // if email exist
 //   const useridexist= await MS_Users.findOne({userid:req.body.userid})
    const emailexist= await MS_Users.findOne({email:req.body.email})
    const usernameexist= await MS_Users.findOne({username:req.body.username})
    const phoneexist= await MS_Users.findOne({phone:req.body.phone})

    // if(useridexist) return res.status(400).json({
    //     status : res.statusCode,
    //     message:'userid exist'
    // })
    if(emailexist) return res.status(400).json({
        status : res.statusCode,
        message:'email already exist'
    })
    if(usernameexist) return res.status(400).json({
        status : res.statusCode,
        message:'username already exist'
    })
    if(phoneexist) return res.status(400).json({
        status : res.statusCode,
        message:'phone already exist'
    })
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(req.body.password, salt);

    const oserPost = new MS_Users({
        username:req.body.username,
        password:hash,
        email:req.body.email,
        phone:req.body.phone,
        token:tokens,
        Remarks:req.body.remarks
    })

    try {
        const oser=await oserPost.save()
        res.json(oser) 
    } catch (error) {
        res.status(400).json({message : error})
    }

})

//login
router.post('/login',async(req,res)=>
{
try { 
    // validasi ID , PW
        const login= await MS_Users.findOne({
            email:req.body.email
        })
        const hash= login.password
        const PW=req.body.password
        const cek =bcrypt.compareSync(PW, hash);
        if (cek) {
            if (login.activation==false) {
                res.status(400).json({
                    id:login._id,
                    message:"Activation Email First"
                })
            } else{
                const data=[]
                data.push({
                    "userid":login._id,
                    "ProjectCompleted": login.ProjectCompleted,
                    "username": login.username,
                    "password": PW,
                    "email": login.email,
                    "phone": login.phone,
                    "token": login.token,
                    "createdDate": login.createdDate,
                    "remarks" : login.Remarks
                }) 
    
                res.status(200).json({
                    status : res.statusCode,
                    message:data
                })
            }
            
        } else {
            res.status(400).json({
                status : res.statusCode,
                message:"Password FALSE"
            })
            
        }     
} catch (error) {
    res.status(400).json({
        status : res.statusCode,
        message : 'login failed'
    })  
}
})


//UPDATE PROFILE
router.post('/UpdateUser/:userid', async(req,res)=>{
    
    let cektoken =  await CheckToken(req.headers.token)
    if (cektoken == 0 ) {
        return res.status(400).json({
            status : res.statusCode,
            message:'Token FAILED'
        })
    }
    const emailexist= await MS_Users.findOne({email:req.body.email})
    const usernameexist= await MS_Users.findOne({username:req.body.username})
    const phoneexist= await MS_Users.findOne({phone:req.body.phone})
    let email=0,phone=0,username=0
    //console.log(usernameexist)
    if (usernameexist) {
        //console.log(req.params.userid+'='+usernameexist.userid)
        if (req.params.userid==usernameexist._id) {
           username=  0
        } else {
            username=  1
        }
    } else {
        username=0
    }
    if (emailexist) {
        if (req.params.userid==emailexist._id) {
            email=  0
         } else {
            email= 1
         }
    }else {
        email=0
    }

    if (phoneexist) {
        if (req.params.userid==phoneexist._id) {
            phone= 0
         } else {
             phone= 1
         }  
    } else {
        phone=0
    }
    const data=[]
    data.push({
        "username":username,
        "email":email,
        "phone":phone
    })

    if (phone==1||username==1||email==1) {
    res.status(400).json(data)  
    }else{
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt);
        try {
            const userUpdate = await MS_Users.updateOne({_id:req.params.userid},{
                username:req.body.username,
                password:hash,
                email:req.body.email,
                phone:req.body.phone,
                Remarks:req.body.remarks
            })
            res.status(200).json({message:"Update sukses"})
        } catch (error) {
          res.status(400).json({message:error})  
        }
    }
})

// activation Email
router.post('/Activation/:_id', async(req,res)=>{
    try {
        const userUpdate = await MS_Users.updateOne({_id:req.params._id},{
            activation:true
        })
        res.status(200).json({message:"Activation User Sukses"})
    } catch (error) {
      res.status(400).json({message:error})  
    }
})


//DELETE
router.delete('/:userid', async(req,res)=>{
    let cektoken =  await CheckToken(req.headers.token)
    if (cektoken == 0 ) {
        return res.status(400).json({
            status : res.statusCode,
            message:'Token FAILED'
        })
    }
    try {
        const userdelete = await MS_Users.deleteOne({_id:req.params.userid})
        res.status(200).json(userdelete)
    } catch (error) {
      res.status(400).json({message:error})  
    }
})

module.exports=router