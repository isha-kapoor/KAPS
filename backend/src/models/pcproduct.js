const mongoose = require("mongoose");


const pcProductSchema = new mongoose.Schema({
  Refid:{//same as that of CRegister
    type:mongoose.Schema.Types.ObjectId,
    ref:'CRegister',
  },
  pcontact:{//private's contact
    type:mongoose.Schema.Types.String,
    ref:'CRegister',
  },
  product:{//what they make
    type:String,
    required:true,
  },
  pname:{//what's the name
    type:mongoose.Schema.Types.String,
    ref:'CRegister',
  },
  padd:{//address
    type:mongoose.Schema.Types.String,
    ref:'CRegister',
  },
  puser:{//username
    type:mongoose.Schema.Types.String,
    ref:'CRegister',
  }

})
//methods are used when working with instances


const PCProduct = new mongoose.model("PCProduct" , pcProductSchema);

module.exports= PCProduct;
