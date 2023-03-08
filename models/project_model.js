const mongoose = require('mongoose')

const OserSchema = mongoose.Schema({
    OwnerID: {
        type:String,
        required:true,
        max :100
    },
    Category: {
    type:String,
    required:true,
    max :100
    }, 
    Name:{
       type:String,
       required:true
    },
    Price:{
       type:Number,
       requred:true
    },
    PublishDate:{
      type:Date,
      default:Date.now
    },
    Deadline:{
     type:Date
    },
    Duration:{
     type:Number,
     requred:true
    },
    Remarks:{
     type:String
    },
    Image: {
    type:String,
    max :100
    }
})

module.exports = mongoose.model('ms_projects',OserSchema)