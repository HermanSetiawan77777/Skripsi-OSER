const mongoose = require('mongoose')

const OserSchema = mongoose.Schema({
    Name:{
       type:String,
       required:true
    }
})

module.exports = mongoose.model('ms_categories',OserSchema)