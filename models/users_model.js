const mongoose = require('mongoose')

const OserSchema = mongoose.Schema({

    username: {
        type:String,
        required : true,
        max :100
    },
    password: {
        type:String,
        required:true,
        max :100
   },
    email: {
    type:String,
    required:true,
    max :100
    },
    
    phone:{
       type:String,
       required:true
   },
    createdDate:{
       type:Date,
       default:Date.now
   },
   ProjectCompleted:{
      type:Number,
      default : 0
    },
    ServicesCompleted:{
       type:Number,
       default : 0
     },
    token:{
        type:String,
        required:true
    },
    Remarks:{
        type:String,
        required:true
    },
    activation:{
        type:Boolean,
        default : false
    }
})

module.exports = mongoose.model('ms_users',OserSchema)