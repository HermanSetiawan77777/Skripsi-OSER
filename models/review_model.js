const mongoose = require('mongoose')

const OserSchema = mongoose.Schema({
    AssignmentID: {
        type:String,
        required:true,
        max :100
    },
    OwnerID: {
        type:String,
        required:true,
        max :100
    },
    UserID:{
       type:String,
       required:true
    },
    Review:{
       type:String
    },
    Rate:{
      type:Number,
      requred:true
    },
    Category:{
     type:String,
     required:true
    }
})

module.exports = mongoose.model('tr_reviews',OserSchema)