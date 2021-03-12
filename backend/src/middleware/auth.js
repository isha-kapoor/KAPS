const jwt = require("jsonwebtoken");
const CRegister = require("../models/ccregisters")

const auth = async(req,res,next) =>{
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
      res.status(401).send(e);
    }
}
module.exports = auth;
