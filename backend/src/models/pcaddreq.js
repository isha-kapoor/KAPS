const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pcAddReqSchema = new mongoose.Schema({
  Refid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'CRegister',
  },
  contact:{
    type:mongoose.Schema.Types.String,
    ref:'CRegister',
  },
  orderDate:{
    type:Date,
  },
  CollectionCentre:{
    type:String,
    required:true,
  },
  RawMaterial:{
    type:String,
    required:true,
  },
  Quantity:{
    type:String,
    required:true,
  },
  date:{
    type:String,
    required:true,
  }

})
//methods are used when working with instances


const PCAddedReq = new mongoose.model("PCAdded" , pcAddReqSchema);

module.exports= PCAddedReq;
