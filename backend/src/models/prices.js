const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pricesSchema = new mongoose.Schema({
    Refid:{ //Reference to registered unique id
        type:mongoose.Schema.Types.ObjectId,
        ref:'CRegister',
      },
    Farmerppk:{ // which product out of wheat straw husk rice husk straw cotton stalk bagasse
        type:Number,
        required:true,
        default: 7,
      },
    PCppk:{
        type:Number,
        required:true,
        default: 10,
    }
})

const Prices = new mongoose.model("Prices" , pricesSchema);

module.exports= Prices;
