const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const FarmerSchema = new mongoose.Schema({
  Refid:{ //Reference to registered unique id
    type:mongoose.Schema.Types.ObjectId,
    ref:'CRegister',
  },
  oid:{ //this is generation of new order id
    type:String,
    unique:true,
    required:true,
  },
  contact:{ // this is the contact of the person who makes the order farmer
    type:mongoose.Schema.Types.String,
    ref:'CRegister',
  },
  orderDate:{ //ordering date
    type:String,
  },
  fcc:{ //which collection centre is the order sent to
    type:mongoose.Schema.Types.String,
    ref:'fRegDetails'
  },
  RawMaterial:{ // which raw material is needed
    type:Array,
    required:true,
  },
  LandArea:{ // land area
    type:Number,
    required:true,
  },
  date:{ // the specified harvesting date
    type:String,
    required:true,
  },
  approve:{ // approved order or not
    type:Boolean,
    default:false,
  },
  pickupdate:{ //Pick up date
    type:String,
  },
  paid:{// whether the private company paid for the order or not
    type:Boolean,
    default:false,
  },
  intransit:{ // in transit order
    type:Boolean,
    default:false,
  },
  ready:{ // payment and waste info
    type:Boolean,
    default:false,
  },
  wasteAmount:{ //waste info
    type:Number,
  },
  paymentAmount:{ //payment amount
    type:Number,
  },
  orderclose:{ //payment date
    type:String
  }
})
//methods are used when working with instances


const FarmerReq = new mongoose.model("FarmerReq" , FarmerSchema);

module.exports= FarmerReq;
