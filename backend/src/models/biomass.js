const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const biomassSchema = new mongoose.Schema({
  Refid:{ //Reference to registered unique id
    type:mongoose.Schema.Types.ObjectId,
    ref:'CRegister',
    unique:false,
  },
  RawMaterial:{ //which product out of wheat straw husk rice husk straw cotton stalk bagasse
    type:String,
    required:true,
    unique:false,
  },
  gross:{ // this is the gross calorific value
    type:String,
    required:true,
  }

})
//methods are used when working with instances
biomassSchema.index({ Refid: 1, RawMaterial: 1 }, { unique: true });


const Biomass = new mongoose.model("Biomass" , biomassSchema);

module.exports= Biomass;
