require("dotenv").config()
const express = require("express");
const bcrypt = require("bcryptjs");
const path = require("path");
const app = express();
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser")
const auth = require("./middleware/auth.js")
require("./db/conn.js");
const CRegister = require("./models/ccregisters");
const PCAddedReq = require("./models/pcaddreq");
const {json} = require("express");
const {log} = require("console");

const port =process.env.PORT || 3000 ;

const static_path = path.join(__dirname, "../public");
const some_path = path.join(__dirname, "../views");
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path))
app.set("view engine", "ejs")
app.set("views",some_path)


// console.log(process.env.SECRET_KEY);

app.get("/", (req,res)=>{
  res.render("index");
})

//collection centre
app.get("/cchome", auth , (req,res)=>{
  res.render("cc/cchome");
})
app.get("/ccprofile" ,auth, (req,res) =>{
  const usercc = CRegister.findOne({_id: req.user._id});
  usercc.exec(function(err,data){
    if(err) throw err;
    res.render("cc/ccprofile", {records:data});
  });
})
app.get("/pcreq" , auth , (req,res) => {
  const privatereq = PCAddedReq.find({CollectionCentre:req.user.ccname});
  privatereq.exec(function(err,data){
    if(err) throw err;
    res.render("cc/pcreq",{order:data});
  })
})
// app.get("/pcreqs/:id" , auth, (req,res)=>{
//   var id = req.params.id;
//   const deleteorder = PCAddedReq.findByIdAndDelete({id});
//   deleteorder.exec(function(err,data){
//     if(err) throw err;
//     res.render("cc/pcreq",{order:data});
//   })
// })



// private company
app.get("/pcAddReq" , auth , (req,res)=>{
  res.render("pc/pcAddReq")
})
app.get("/pchome" , auth , (req,res)=>{
  res.render("pc/pchome")
} )
app.get("/pcpending" , auth , async(req,res)=>{
  const orders = PCAddedReq.find({Refid:req.user._id});
  orders.exec(function(err,data){
    if(err) throw err;
    res.render("pc/pcpending" , {order:data});
  })
  console.log(orders);
})
app.get("/pcprofile" ,auth, (req,res) =>{

  const usercc = CRegister.findOne({_id: req.user._id});
  usercc.exec(function(err,data){
    if(err) throw err;
    res.render("pc/pcprofile", {records:data});
  });
})
app.post("/pcAddReq" , auth , async(req,res)=>{
  try{
      const pcaddreq = new PCAddedReq({
        Refid: req.user._id,
        orderDate: Date(),
        contact:req.user.cccontact,
        CollectionCentre: req.body.CollectionCentre,
        RawMaterial: req.body.RawMaterial,
        Quantity: req.body.Quantity,
        date:req.body.date
      })
      console.log(pcaddreq);
      const pcNewAddReq =await pcaddreq.save();
      console.log(pcNewAddReq);
      res.status(201).render("pc/pchome");
  }
  catch(e){
    res.status(400).send(e);
    console.log("There are some errors regarding the new request addition" );
  }
})

//registeration part
app.post("/newcc-username" , async(req,res) => {
  try{
    const password = req.body.ccpassword;
    const confirm = req.body.ccconfirm;
    if(password === confirm){
          const collectioncentre = new CRegister({
            ccname: req.body.ccname,
            ccadd:req.body.ccadd,
            cccontact:req.body.cccontact,
            ccusername : req.body.ccusername,
            ccpassword : req.body.ccpassword,
            ccconfirm : req.body.ccconfirm,
            select:req.body.select
          }) // this is an instance

        //here the bcrypt is used
        //to generte a createToken
        console.log(collectioncentre);
        const new_token = await collectioncentre.generateAuthToken();
        console.log(new_token);

        res.cookie("jwt" , new_token ,{
          expires: new Date(Date.now() + 3000000),
          httpOnly:true
        } );
        // console.log(cookie);

        const collectioncentreRegisteration =await collectioncentre.save();
        console.log(collectioncentreRegisteration);
        const whoAmI = req.body.select;

        const cc =  "CollectionCentre";
        const f = "Farmer";
        const pc = "PrivateCompany";
        if( whoAmI == cc) res.status(201).render("cc/cchome");
        else if(whoAmI == f) res.status(201).render("index");
        else if(whoAmI == pc) res.status(201).render("pc/pchome");
        else res.status(201).render("signed")

    }else{
      res.send("Passwords Do Not Match");
    }
  }
  catch(error){
    res.status(400).send(error);
    console.log("There are some errors" );

  }
})

app.get("/newcc-username" ,(req,res) =>{
  res.render("newcc-username");
})
app.get("/login" ,(req,res) =>{
  res.render("login");
})
//login part
app.post("/login" , async(req,res) => {
  try{
      const username = req.body.username;
      const pass = req.body.password;
      // console.log(`${username} ${pass}`);

      const user =   await  CRegister.findOne({ccusername : username })
      const isMatched = await  bcrypt.compare(pass,user.ccpassword)

      const new_token = await user.generateAuthToken();
      console.log(new_token);

      res.cookie("jwt" , new_token ,{
        expires: new Date(Date.now() + 3000000),
        httpOnly:true
      } );

      console.log(`the cookie is : ${req.cookies.jwt}`);

      if(isMatched && user.select=="CollectionCentre"){
        res.status(201).render("cc/cchome")
      }
      else if(isMatched && user.select =="Farmer"){
        res.status(201).render("index")
      }
      else if(isMatched && user.select == "PrivateCompany"){
        res.status(201).render("pc/pchome")
      }
      else{
        res.send("Error in credentials")
      }
  // res.send(user);
  // console.log(user);
  }catch(error){
    res.status(400).send(error);
  }
})


//logout part
app.get("/logout" , auth , async(req,res)=>{
  try {
    console.log(req.user);
    // removing only current login detail for the user
    // req.user.tokens = req.user.tokens.filter((currElem)=>{
    //     return currElem.token !== req.token;
    // })
    //removing all login  details from all devices
    req.user.tokens = [];

    res.clearCookie("jwt");
    await req.user.save();
    console.log("logged out Successful");
    res.render("index");
  } catch (e) {
  await  res.status(500).send(e);
  console.log("Not Happening");
  }
});

app.listen(port ,()=>{
  console.log(`Server is connected ${port}` );
})
