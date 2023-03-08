const mongoose = require('mongoose')

const OserSchema = mongoose.Schema({
    
    OwnerID:{
       type:String,
       required:true
    },
    Portofolio: {
    type:String,
    required:true,
    max :100
    },
    Remarks: {
    type:String,
    required:true,
    max :100
    }
})

module.exports = mongoose.model('ms_portofolio',OserSchema)