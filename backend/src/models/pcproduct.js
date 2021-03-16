const mongoose = require("mongoose");


const pcProductSchema = new mongoose.Schema({
  Refid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'CRegister',
  },
  pcontact:{
    type:mongoose.Schema.Types.String,
    ref:'CRegister',
  },
  product:{
    type:String,
    required:true,
  },
  pname:{
    type:mongoose.Schema.Types.String,
    ref:'CRegister',
  },
  padd:{
    type:mongoose.Schema.Types.String,
    ref:'CRegister',
  },
  puser:{
    type:mongoose.Schema.Types.String,
    ref:'CRegister',
  }

})
//methods are used when working with instances


const PCProduct = new mongoose.model("PCProduct" , pcProductSchema);

module.exports= PCProduct;
