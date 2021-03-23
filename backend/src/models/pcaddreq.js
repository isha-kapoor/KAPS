const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pcAddReqSchema = new mongoose.Schema({
  Refid:{ //Reference to registered unique id
    type:mongoose.Schema.Types.ObjectId,
    ref:'CRegister',
  },
  oid:{ //this is generation of new order id
    type:String,
    unique:true,
    required:true,
  },
  pid:{ // what product does the PrivateCompany makes
    type:mongoose.Schema.Types.String,
    ref:'PCProduct',
  },
  contact:{ // this is the contact of the person who makes the order private
    type:mongoose.Schema.Types.String,
    ref:'CRegister',
  },
  orderDate:{ //ordering date
    type:String,
  },
  CollectionCentre:{ //which collection centre is the order sent to
    type:String,
    required:true,
  },
  RawMaterial:{ // which raw material is needed
    type:String,
    required:true,
  },
  Quantity:{ // the quantity of the raw material needed
    type:Number,
    required:true,
  },
  date:{ // the specified pickup date
    type:String,
    required:true,
  },
  approve:{ // approved order or not
    type:Boolean,
    default:false,
  },
  paid:{// whether the private company paid for the order or not
    type:Boolean,
    default:false,
  },
  payment:{// the amount that is to be paid by private company
    type:Number,
  }

})
//methods are used when working with instances


const PCAddedReq = new mongoose.model("PCAdded" , pcAddReqSchema);

module.exports= PCAddedReq;
