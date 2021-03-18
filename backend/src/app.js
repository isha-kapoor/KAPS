require("dotenv").config()
const moment = require('moment');
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
const PCProduct = require("./models/pcproduct");
const Waste = require("./models/waste");
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
//The home page of collection Centre
app.get("/cchome", auth , (req,res)=>{
  res.render("cc/cchome");
})
//THe profile page of CollectionCentre
app.get("/ccprofile" ,auth, (req,res) =>{
  const usercc = CRegister.findOne({_id: req.user._id});
  usercc.exec(function(err,data){
    if(err) throw err;
    res.render("cc/ccprofile", {records:data});
  });
})
//The page where the collection centre sees the requests of private companies
app.get("/pcreq" , auth , (req,res) => {
  const privatereq = PCAddedReq.find({CollectionCentre:req.user.ccname , paid:false});
   // date :{$gte:moment(Date.now()).format('DD/MM/YYYY')} approve:false approved and not paid
  privatereq.exec(function(err,data){
    if(err) throw err;
    res.render("cc/pcreq",{order:data});
  })
})
//The page where the collection centre will see the completed requests of private companies that is fullyy paid requests
app.get("/pcclosedreq" , auth , (req,res) => {
  const privateclosedreq = PCAddedReq.find({CollectionCentre:req.user.ccname , paid:true , approve:true});
  privateclosedreq.exec(function(err,data){
    if(err) throw err;
    res.render("cc/pcclosereq",{order:data});
  })
})
//This is a link where the request for a particular id is approved by the collection centre
app.get("/approve/:id", auth , (req,res) => {
  var id = req.params.id;
  PCAddedReq.findByIdAndUpdate(id, { approve: 'true' },
      function (err, data) {
        if(err) throw err;
        res.redirect("/pcreq")
      })
})
//This is a link where the request for a particular id is marked paid by the collection centre
app.get("/delete/:id" , auth, (req,res)=>{
  var id = req.params.id;
  PCAddedReq.findByIdAndUpdate(id, { paid: 'true' },
      function (err, data) {
        if(err) throw err;
        res.redirect("/pcreq")
  })
})
//This is the waste Database for collection centre where it is displayed
app.get("/ccwasteDB",auth,(req,res)=>{
  const waste = Waste.find({Refid: req.user._id});
  waste.exec(function(err,data){
    if(err) throw err;
    res.render("cc/ccwasteDB", {records:data});
  });
})
//edit the database only on what raw material you choose
app.get("/wasteDB/:id", auth , (req,res)=>{
  const waste = Waste.findById(req.params.id);
  waste.exec(function(err,doc){
    if(err){throw err}
      res.render("cc/wasteDB" , {
        records:doc
      });
    })
})
//THis is where they can add the database if already added you can only edit it.  displays only the left over raw materials to be added
app.get("/wasteDB" , auth , (req,res)=>{
  var arr1=["Wheat Husk" , "Wheat Straw" , "Rice Husk" ,"Rice Straw" ,"Cotton Stalk" ,"Bagasse"];
  try{
  const material = Waste.find({Refid: req.user._id});
  var arr=[];
  var common;
  console.log(material);
  material.exec(function(err,doc){
      if(err) { throw err;}
       console.log(doc);
      if(!doc.length){
        arr=[];
        common=arr1.filter(x=>arr.indexOf(x)===-1);
        res.render("cc/waste" ,{records:common});
      }
      else {
           Object.entries(doc).forEach(item=>{
           const [key,value]=item;
           arr.push(value.RawMaterial);
           // console.log(value.RawMaterial);
           common = arr1.filter(x=>arr.indexOf(x)===-1); //finds the difference in elements that arr1 has but not arr
            // console.log(typeof(common));
         })
          console.log(typeof(common));
         if(common=='') {
           res.redirect("/ccwasteDB")
         }
         else  res.render("cc/waste" ,{records:common})
     }
  })
}
catch(e){
  console.log(e);
  res.send("Error in displaying")
}
})

//This is the post method for wastes whenever anything is updated or newly added
app.post("/wasteDB" , auth , async(req,res)=>{
  try {
    Waste.findOneAndUpdate({RawMaterial:req.body.RawMaterial , Refid:req.user._id},{
        RawMaterial:req.body.RawMaterial,
        Refid:req.user._id,
        open:req.body.open,
        processing:req.body.processing,
        ready:req.body.ready,
      },{upsert:true},
      function (err) {
        if(err) throw err;
        res.status(201).redirect("/ccwasteDB")
  })
  } catch (e) {
    res.status(400).send(e);
    console.log("There are some errors regarding initial waste" );
  }
})


// private company
//The product that we will make after booking the raw materials
app.get("/whatmake" , auth , (req,res)=>{
  res.render("pc/whatmake")
})
//THis is the private company's home
app.get("/pchome" , auth , (req,res)=>{
  res.render("pc/pchome")
})
//This is the profile page for private Company
app.get("/pcprofile" ,auth, (req,res) =>{

  const usercc = PCProduct.findOne({Refid: req.user._id});
  usercc.exec(function(err,data){
    if(err) throw err;
    res.render("pc/pcprofile", {records:data});
  });
})
//This is the page where the private company would add the order
app.get("/pcAddReq" , auth , (req,res)=>{
  res.render("pc/pcAddReq")
})
//This displays the pending orders of the private company
app.get("/pcpending" , auth , async(req,res)=>{
  const orders = PCAddedReq.find({Refid:req.user._id , paid:false});
  orders.exec(function(err,data){
    if(err) throw err;
    res.render("pc/pcpending" , {order:data});
  })
  console.log(orders);
})
//This shows the orders which are fully paid collected for private company
app.get("/pcClosed" , auth , async(req,res)=>{
  const closedorders = PCAddedReq.find({Refid:req.user._id , paid:true , approve:true});
  closedorders.exec(function(err,data){
    if(err) throw err;
    res.render("pc/pcclosed" , {order:data});
  })
  console.log(orders);
})
//To store the details of the product made
app.post("/whatmake" , auth , async(req,res)=>{
  try{
      const pc = new PCProduct({
        Refid:req.user._id,
        pcontact:req.user.cccontact,
        product:req.body.product,
        pname:req.user.ccname,
        padd:req.user.ccadd,
        puser:req.user.ccusername,
      })
      const pcNew =await pc.save();
      res.status(201).render("pc/pchome");
  }
  catch(e){
    res.status(400).send(e);
    console.log("There are some errors regarding the new request addition regarding what product" );
  }
})
//This is a post request page for private company where they will add the orders and save it to database
app.post("/pcAddReq" , auth , async(req,res)=>{
  try{
    const products = await PCProduct.findOne({Refid:req.user._id });
      const pcaddreq = new PCAddedReq({
        Refid: req.user._id,
        oid:(Date.now().toString() + Math.floor(Math.random()*10)).slice(8,14),
        pid: products.product,
        orderDate: moment(Date.now()).format('DD/MM/YYYY'),
        contact:req.user.cccontact,
        CollectionCentre: req.body.CollectionCentre,
        RawMaterial: req.body.RawMaterial,
        Quantity: req.body.Quantity,
        date:req.body.date,
        payment:req.body.Quantity*10,
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

//registeration part for farmer , collection centre , private company
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
        else if(whoAmI == pc) res.status(201).render("pc/whatmake");
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

//This opens the registeration page
app.get("/newcc-username" ,(req,res) =>{
  res.render("newcc-username");
})
//This is the login page for all three stakeholders
app.get("/login" ,(req,res) =>{
  res.render("login");
})
//login part for them
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


//logout part for all the users
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
//This is the initial connection setup
app.listen(port ,()=>{
  console.log(`Server is connected ${port}` );
})
