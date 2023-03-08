const mongoose = require('mongoose')

const OserSchema = mongoose.Schema({
    OwnerID: {
        type:String,
        required:true,
        max :100
    },
    
    ServicesName: {
    type:String,
    required:true,
    max :100
    },
    
    Category:{
       type:String,
       required:true
     },

    Duration:{
    type:Number,
    required:true
    },

    Price:{
       type:Number,
    },

    Remarks:{
      type:String,
    },
    Image: {
    type:String,
    max :100
    }
})

module.exports = mongoose.model('ms_services',OserSchema)