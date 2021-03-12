const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ccSchema = new mongoose.Schema({
  ccname:{
    type:String,
    required:true,
  },
  ccadd:{
    type:String,
    required:true,
  },
  cccontact:{
    type:String,
    required:true,
  },
  ccusername:{
    type:String,
    required:true,
    unique:true
  },
  ccpassword:{
    type:String,
    required:true
  },
  ccconfirm:{
    type:String,
    required:true
  },
  select:{
    type:String,
    required:true
  },
  tokens:[{
    token:{
      type:String,
      required:true
    }
  }]
})
//methods are used when working with instances


ccSchema.methods.generateAuthToken = async function(){
  try {
   console.log(this._id);
    const new_token = await jwt.sign({_id:this._id}, process.env.SECRET_KEY)
    this.tokens = this.tokens.concat({token:new_token})
     console.log(new_token);
    await this.save();
    return new_token;
  } catch (e) {
      res.send("there is an error" +  e);
      console.log(e);
  }
}
// pre is the concept of middleware
// ID card check
//learn the concept of middleware
ccSchema.pre("save" , async function(next){
  // console.log(`${this.ccpassword}`);
  // const hashedpass = await  bcrypt.hash(password , 8 );
  if(this.isModified("ccpassword")){
  //  console.log(`${this.ccpassword}`);
      this.ccpassword = await  bcrypt.hash(this.ccpassword,8);
      this.ccconfirm = this.ccpassword;
  //   console.log(`${this.ccpassword}`);
  }
  next();
})
const CRegister = new mongoose.model("CRegister" , ccSchema);

module.exports= CRegister;
