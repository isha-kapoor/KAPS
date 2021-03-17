const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const wasteSchema = new mongoose.Schema({
  Refid:{ //Reference to registered unique id
    type:mongoose.Schema.Types.ObjectId,
    ref:'CRegister',
  },
  RawMaterial:{
    type:String,
    required:true,
    unique:true,
  },
  open:{
    type:Number,
    required:true,
    default:0,
  },
  processing:{
    type:Number,
    required:true,
    default:0,
  },
  ready:{
    type:Number,
    required:true,
    default:0,
  }

})
//methods are used when working with instances


const Waste = new mongoose.model("Waste" , wasteSchema);

module.exports= Waste;
