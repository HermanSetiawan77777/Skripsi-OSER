const mongoose = require('mongoose')

const OserSchema = mongoose.Schema({
    
    AssignmentID:{
       type:String,
       required:true
    },
    OwnerID: {
    type:String,
    required:true,
    max :100
    },
    UserID: {
    type:String,
    required:true,
    max :100
    },
    OwnerChat:{
       type:String
    },
    UserChat:{
      type:String
    },
    PublishDate:{
      type:Date,
      default:Date.now
    },
    Category:{
      type:String
    }
})

module.exports = mongoose.model('ms_chat',OserSchema)