const mongoose = require("mongoose");


const fRegDetailsSchema = new mongoose.Schema({
  Refid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'CRegister',
  },
  fname:{
    type:mongoose.Schema.Types.String,
    ref:'CRegister',
  },
  fadd:{
    type:mongoose.Schema.Types.String,
    ref:'CRegister',
  },
  fcontact:{
    type:mongoose.Schema.Types.String,
    ref:'CRegister',
  },
  fuser:{
    type:mongoose.Schema.Types.String,
    ref:'CRegister',
  },
  fcc:{
    type:String,
    required:true,
  },
  fKcrops:{
      type: Array,
      required:true,
      default:[],
  },
  fRcrops:{
    type: Array,
    required:true,
    default:[],
},

  

})
//methods are used when working with instances


const fRegDetails = new mongoose.model("fRegDetails" , fRegDetailsSchema);

module.exports= fRegDetails;
