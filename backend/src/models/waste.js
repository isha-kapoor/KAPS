const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const wasteSchema = new mongoose.Schema({
  Refid:{ //Reference to registered unique id
    type:mongoose.Schema.Types.ObjectId,
    ref:'CRegister',
    unique:false,
  },
  RawMaterial:{ // which product out of wheat straw husk rice husk straw cotton stalk bagasse
    type:String,
    required:true,
    unique:false,
  },
  open:{ // amount of open waste
    type:Number,
    required:true,
    default:0,
  },
  processing:{ // amount of waste under processing
    type:Number,
    required:true,
    default:0,
  },
  ready:{ // the ready waste
    type:Number,
    required:true,
    default:0,
  }

})
//methods are used when working with instances
wasteSchema.index({ Refid: 1, RawMaterial: 1 }, { unique: true });


const Waste = new mongoose.model("Waste" , wasteSchema);

module.exports= Waste;
