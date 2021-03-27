const jwt = require("jsonwebtoken");
const CRegister = require("../models/ccregisters")

// const auth = async(req,res,next) =>{
//     try {
//         const new_token = req.cookies.jwt;
//         const verifyUser =await jwt.verify(new_token , process.env.SECRET_KEY)
//         console.log(verifyUser);
//
//         const userData = await CRegister.findOne({_id:verifyUser._id});
//         console.log(userData);
//
//         req.token = new_token;
//         req.user = userData;
//
//         next();
//     } catch (e) {
//       res.status(401).send(e);
//     }
// }

// const authrole = async(req,res,next)=>{
//   try{
//     if(select===req.user.select){
//     next();
//   }
//   else res.status(401).send(e)
//   }catch(e){
//     res.status(401).send(e);
//   }
// }

function auth() {
  return async(req,res,next)=>{
      try {
          const new_token = req.cookies.jwt;
          const verifyUser =await jwt.verify(new_token , process.env.SECRET_KEY)
          console.log(verifyUser);

          const userData = await CRegister.findOne({_id:verifyUser._id});
          console.log(userData);

          req.token = new_token;
          req.user = userData;

          next();
      } catch (e) {
        res.status(401)
        return res.send("E")
      }
}
}

function authrole(select) {
  return (req,res,next)=>{
    if(req.user.select !== select){
      res.status(401)
      return res.send("You are not authorized to open this page");
    }
    next();
  }
}
module.exports = {
  auth,
  authrole
}
