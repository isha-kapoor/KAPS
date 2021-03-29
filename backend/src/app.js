require("dotenv").config()
const moment = require('moment');
const express = require("express");
const bcrypt = require("bcryptjs");
const path = require("path");
const app = express();
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser")
const {auth} = require("./middleware/auth.js")
const {authrole} = require("./middleware/auth.js")
require("./db/conn.js");
const CRegister = require("./models/ccregisters");
const PCAddedReq = require("./models/pcaddreq");
const PCProduct = require("./models/pcproduct");
const Waste = require("./models/waste");
const Biomass = require("./models/biomass");
const FarmerReq= require("./models/FarmerReq");
const {json} = require("express");
const {log} = require("console");
const fRegDetails = require("./models/fregdetail");

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
app.get("/cchome", auth() , authrole("CollectionCentre"), (req,res)=>{
  res.render("cc/cchome");
})
//THe profile page of CollectionCentre
app.get("/ccprofile" ,auth(),authrole("CollectionCentre"), (req,res) =>{
  const usercc = CRegister.findOne({_id: req.user._id});
  usercc.exec(function(err,data){
    if(err) throw err;
    res.render("cc/ccprofile", {records:data});
  });
})
//The page where the collection centre sees the requests of private companies
app.get("/pcreq" , auth() ,authrole("CollectionCentre"), (req,res) => {
  const privatereq = PCAddedReq.find({CollectionCentre:req.user.ccname , paid:false});
   // date :{$gte:moment(Date.now()).format('DD/MM/YYYY')} approve:false approved and not paid
  privatereq.exec(function(err,data){
    if(err) throw err;
    res.render("cc/pcreq",{order:data});
  })
})
//The page where the collection centre will see the completed requests of private companies that is fullyy paid requests
app.get("/pcclosedreq" , auth() ,authrole("CollectionCentre"), (req,res) => {
  const privateclosedreq = PCAddedReq.find({CollectionCentre:req.user.ccname , paid:true , approve:true});
  privateclosedreq.exec(function(err,data){
    if(err) throw err;
    res.render("cc/pcclosereq",{order:data});
  })
})
//This is a link where the request for a particular id is approved by the collection centre of a private company
app.get("/approve/:id", auth() ,authrole("CollectionCentre"), (req,res) => {
  var id = req.params.id;
  PCAddedReq.findByIdAndUpdate(id, { approve: 'true' },
      function (err, data) {
        if(err) throw err;
        res.redirect("/pcreq")
      })
})
//This is a link where the request for a particular id is marked paid by the collection centre of a private company
app.get("/delete/:id" , auth(), authrole("CollectionCentre"),(req,res)=>{
  var id = req.params.id;
  PCAddedReq.findByIdAndUpdate(id, { paid: 'true' },
      function (err, data) {
        if(err) throw err;
        res.redirect("/pcreq")
  })
})
//This is the waste Database for collection centre where it is displayed
app.get("/ccwasteDB",auth(),authrole("CollectionCentre"),(req,res)=>{
  const waste = Waste.find({Refid: req.user._id});
  waste.exec(function(err,data){
    if(err) throw err;
    res.render("cc/ccwasteDB", {records:data});
  });
})
//edit the database only on what raw material you choose
app.get("/wasteDB/:id", auth() ,authrole("CollectionCentre"), (req,res)=>{
  const waste = Waste.findById(req.params.id);
  waste.exec(function(err,doc){
    if(err){throw err}
      res.render("cc/wasteDB" , {
        records:doc
      });
    })
})
//THis is where they can add the database if already added you can only edit it.  displays only the left over raw materials to be added
app.get("/wasteDB" , auth() ,authrole("CollectionCentre"), (req,res)=>{
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
app.post("/wasteDB" , auth() ,authrole("CollectionCentre"), async(req,res)=>{
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
//To open the biomass Characterization page
app.get("/biomass",auth(),authrole("CollectionCentre"),(req,res)=>{
  const waste = Biomass.find({Refid: req.user._id});
  waste.exec(function(err,data){
    if(err) throw err;
    res.render("cc/biomass", {records:data});
  });
})
// Edit the Biomass database
app.get("/biomassDB/:id", auth() ,authrole("CollectionCentre"), (req,res)=>{
  const waste = Biomass.findById(req.params.id);
  waste.exec(function(err,doc){
    if(err){throw err}
      res.render("cc/biomassedit" , {
        records:doc
      });
    })
})
//THis is where they can add the database BIomass if already added you can only edit it.  displays only the left over raw materials to be added
app.get("/biomassDB" , auth() ,authrole("CollectionCentre"), (req,res)=>{
  var arr1=["Wheat Husk" , "Wheat Straw" , "Rice Husk" ,"Rice Straw" ,"Cotton Stalk" ,"Bagasse"];
  try{
  const material = Biomass.find({Refid: req.user._id});
  var arr=[];
  var common;
  console.log(material);
  material.exec(function(err,doc){
      if(err) { throw err;}
       console.log(doc);
      if(!doc.length){
        arr=[];
        common=arr1.filter(x=>arr.indexOf(x)===-1);
        res.render("cc/biomassadd" ,{records:common});
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
           res.redirect("/biomass")
         }
         else  res.render("cc/biomassadd" ,{records:common})
     }
  })
}
catch(e){
  console.log(e);
  res.send("Error in displaying the biomass")
}
})

//This is the post method for biomass whenever anything is updated or newly added
app.post("/biomassDB" , auth() ,authrole("CollectionCentre"), async(req,res)=>{
  try {
    Biomass.findOneAndUpdate({RawMaterial:req.body.RawMaterial , Refid:req.user._id},{
        RawMaterial:req.body.RawMaterial,
        Refid:req.user._id,
        gross:req.body.gross,
      },{upsert:true},
      function (err) {
        if(err) throw err;
        res.status(201).redirect("/biomass")
  })
  } catch (e) {
    res.status(400).send(e);
    console.log("There are some errors regarding initial biomass data to be added" );
  }
})

//Farmers Requests the incoming one to collect it
app.get("/Farmerreq" , auth() ,authrole("CollectionCentre"), (req,res) => {
  const reqs = FarmerReq.find({fcc:req.user.ccname , paid:false});
   // date :{$gte:moment(Date.now()).format('DD/MM/YYYY')} approve:false approved and not paid
  reqs.exec(function(err,data){
    if(err) throw err;
    res.render("cc/Farmerreq",{order:data});
  })
})
//to tell the farmer that the order is approved
app.get("/check/:id", auth() ,authrole("CollectionCentre"), (req,res) => {
  var id = req.params.id;
  FarmerReq.findByIdAndUpdate(id, { approve: 'true' , $set:{pickupdate: moment(Date.now()).add(10,'day').format('DD/MM/YYYY')} },
      function (err, data) {
        if(err) throw err;
        res.redirect("/Farmerreq")
      })
})
// to tell the farmer the order is in transit
app.get("/transit/:id", auth() ,authrole("CollectionCentre"), (req,res) => {
  var id = req.params.id;
  FarmerReq.findByIdAndUpdate(id, { intransit: 'true' },
      function (err, data) {
        if(err) throw err;
        res.redirect("/Farmerreq")
      })
})
//to tell the farmer payment is ready
app.get("/ready/:id", auth() ,authrole("CollectionCentre"), (req,res) => {
  var id = req.params.id;
  FarmerReq.findById(id,
      function (err, data) {
        if(err) throw err;
        res.render("cc/farmerwaste" ,{orders:data});
      })
})
//to tell the farmer about the waste
app.post("/ready/:id", auth() ,authrole("CollectionCentre"), (req,res) => {
  var id = req.params.id;
  FarmerReq.findOneAndUpdate({_id:id} ,{
    wasteAmount:req.body.wasteAmount,
    paymentAmount:req.body.wasteAmount*7,
    ready:true,
  },{upsert:true},
  function (err) {
    if(err) throw err;
    res.status(201).redirect("/FarmerReq")
})
})
//to mark farmers things closed
app.get("/paid/:id", auth() ,authrole("CollectionCentre"), (req,res) => {
  var id = req.params.id;
  FarmerReq.findByIdAndUpdate(id, { paid: 'true' , orderclose:moment(Date.now()).format('DD/MM/YYYY')},
      function (err, data) {
        if(err) throw err;
        res.redirect("/Farmerreq")
      })
})
//farmers closed requests
app.get("/fclosedreq" , auth() ,authrole("CollectionCentre"), (req,res) => {
  const fcreq = FarmerReq.find({fcc:req.user.ccname , paid:true , approve:true,intransit:true,ready:true});
  fcreq.exec(function(err,data){
    if(err) throw err;
    res.render("cc/fcclosereq",{order:data});
  })
})
// --------------------



// private company
//The product that we will make after booking the raw materials
app.get("/whatmake" , auth() ,authrole("PrivateCompany"), (req,res)=>{
  res.render("pc/whatmake")
})
//THis is the private company's home
app.get("/pchome" , auth() ,authrole("PrivateCompany"), (req,res)=>{
  res.render("pc/pchome")
})
//This is the profile page for private Company
app.get("/pcprofile" ,auth(),authrole("PrivateCompany"), (req,res) =>{

  const usercc = PCProduct.findOne({Refid: req.user._id});
  usercc.exec(function(err,data){
    if(err) throw err;
    res.render("pc/pcprofile", {records:data});
  });
})
//This is the page where the private company would add the order
app.get("/pcAddReq" , auth() ,authrole("PrivateCompany"), (req,res)=>{
  const cc = CRegister.find({select:"CollectionCentre"});
  cc.exec(function(err,data){
    if(err) throw err;
    res.render("pc/pcAddReq" , {records:data})
  })
  // res.render("pc/pcAddReq")
})
//This displays the pending orders of the private company
app.get("/pcpending" , auth() ,authrole("PrivateCompany"), (req,res)=>{
  const orders = PCAddedReq.find({Refid:req.user._id , paid:false});
  orders.exec(function(err,data){
    if(err) throw err;
    res.render("pc/pcpending" , {order:data});
  })
  console.log(orders);
})
//This shows the orders which are fully paid collected for private company
app.get("/pcClosed" , auth() ,authrole("PrivateCompany"), (req,res)=>{
  const closedorders = PCAddedReq.find({Refid:req.user._id , paid:true , approve:true});
  closedorders.exec(function(err,data){
    if(err) throw err;
    res.render("pc/pcclosed" , {order:data});
  })
  console.log(orders);
})
//To store the details of the product made
app.post("/whatmake" , auth() ,authrole("PrivateCompany"), async(req,res)=>{
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
app.post("/pcAddReq" , auth() ,authrole("PrivateCompany"), async(req,res)=>{
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
//Select Collection Centre to view Raw materials
app.get("/selectcc" , auth() ,authrole("PrivateCompany"), (req,res)=>{
  const cc = CRegister.find({select:"CollectionCentre"});
  cc.exec(function(err,data){
    if(err) throw err;
    res.render("pc/selectcc" , {records:data})
  })
  // res.render("pc/selectcc")
})

//post the selectcc to view the ready waste for the respective cc
app.post("/selectcc" , auth() , authrole("PrivateCompany"),async(req,res)=>{
  console.log(req.body.CollectionCentre);
  try{
    const logindata =  await CRegister.findOne({ccname:req.body.CollectionCentre})
    //console.log("Id" +logindata._id);
    const wastedata =  Waste.find({Refid:logindata._id});
    wastedata.exec(function(err,data){
      if(err) { throw err; res.send("There is no data available for the request")}
      //console.log(data);
      res.render("pc/rawCatalog" , {order:data});
    })
  // res.status(201).redirect("/selectcc")
}
catch(e){
  res.send("There is no data available for the request" + e);
  console.log("Errors displaying the waste record")
}
})
//For seeing the raw materials catalog
app.get("/rawcatalog", auth() ,authrole("PrivateCompany"),(req,res)=>{
  res.render("pc/rawCatalog")
})


//Farmer
// ------------------------
//To store additional registration details of new farmer
app.post("/farmerregdetails" , auth() ,authrole("Farmer"), async(req,res)=>{
  try{
    const pc = new fRegDetails({
        Refid:req.user._id,
        fcontact:req.user.cccontact,
        fname:req.user.ccname,
        fadd:req.user.ccadd,
        fuser:req.user.ccusername,
        fcc:req.body.fcc,
       fKcrops:req.body.fKcrops,
       fRcrops:req.body.fRcrops,
    })
      const pcNew =await pc.save();
      res.status(201).render("farmer/fhome");
  }
  catch(e){
    res.status(400).send(e);
    console.log("There are some errors regarding the new request addition regarding what product" );
  }
})
//Farmer home page
app.get("/fhome" ,auth() ,authrole("Farmer"), (req,res) =>{
  res.render("farmer/fhome");
})

//To open farmer additional reg details page
app.get("/farmerregdetails" ,auth(),authrole("Farmer"), (req,res) =>{
  const cc = CRegister.find({select:"CollectionCentre"});
  cc.exec(function(err,data){
    if(err) throw err;
    res.render("farmer/reg-farmer-details" , {records:data})
  })
})

//For farmer to request pickup
app.get("/requestpickup" ,auth(),authrole("Farmer"),(req,res) =>{
  const userfarmer = fRegDetails.findOne({Refid: req.user._id});
  var cropslist = [];
  userfarmer.exec(function(err,data){
    if(err) throw err;
    else{
      console.log(typeof(data.fKcrops));
      for (i=0 ; i< data.fKcrops.length ; i++){
        cropslist.push(data.fKcrops[i]);
      }
      for (i=0 ; i< data.fRcrops.length ; i++){
        cropslist.push(data.fRcrops[i]);
      }
      let crops = cropslist.filter((e, i) => cropslist.indexOf(e) === i);
      console.log(typeof(crops));
      console.log(crops);
    res.render("farmer/requestpickup", {records:crops});
  }
  });
})
//For farmer to see catalog 
app.get("/fresiduecatalog" ,auth,(req,res) =>{
  res.render("farmer/fresiduecatalog");
})


//post request farmer
app.post("/requestpickup" , auth() ,authrole("Farmer"), async(req,res)=>{
  try{
    const cc = await fRegDetails.findOne({Refid:req.user._id });
      const freq = new FarmerReq({
        Refid: req.user._id,
        oid:(Date.now().toString() + Math.floor(Math.random()*10)).slice(8,14),
        contact:req.user.cccontact,
        fcc: cc.fcc,
        orderDate: moment(Date.now()).format('DD/MM/YYYY'),
        RawMaterial: req.body.RawMaterial,
        LandArea: req.body.LandArea,
        date:req.body.date,
      })
      console.log(freq);
      const fnew =await freq.save();
      console.log(fnew);
      res.status(201).render("farmer/fhome");
  }
  catch(e){
    res.status(400).send(e);
    console.log("There are some errors regarding the new request addition" );
  }
})
//to open the profile page of farmer personal
app.get("/farmerprofile" , auth() ,authrole("Farmer"), (req,res)=>{
  const userfarmer = fRegDetails.findOne({Refid: req.user._id});
  userfarmer.exec(function(err,data){
    if(err) throw err;
    res.render("farmer/fprofile", {records:data});
  });
})
//related to crops and collection centre
app.get("/fprofilecc" , auth() ,authrole("Farmer"), (req,res)=>{
  const userfarmer = fRegDetails.findOne({Refid: req.user._id});
  userfarmer.exec(function(err,data){
    if(err) throw err;
    res.render("farmer/fprofilecc", {records:data});
  });
})
//pending requests
app.get("/fpending" , auth() ,authrole("Farmer"), (req,res)=>{
  const orders = FarmerReq.find({Refid:req.user._id , paid:false});
  orders.exec(function(err,data){
    if(err) throw err;
    res.render("farmer/fpending" , {order:data});
  })
  console.log(orders);
})
//closed requests
app.get("/fcompleted" , auth() ,authrole("Farmer"), (req,res)=>{
  const orders = FarmerReq.find({Refid:req.user._id , paid:true});
  orders.exec(function(err,data){
    if(err) throw err;
    res.render("farmer/fclose" , {order:data});
  })
  console.log(orders);
})
//view invoice
app.get("/viewinvoice", auth() ,authrole("Farmer"), (req,res)=>{
  const orders = FarmerReq.find({Refid:req.user._id});
  orders.exec(function(err,data){
    if(err) throw err;
    res.render("farmer/invoice" , {order:data});
  })
  console.log(orders);
})
app.get("/notifications" , auth() ,authrole("Farmer"), (req,res)=>{
  const orders = FarmerReq.find({Refid:req.user._id});
  orders.exec(function(err,data){
    if(err) throw err;
    res.render("farmer/notifications" , {order:data});
  })
})

//-----------------------
//Admin based pages
app.get("/ahome",auth(),authrole(process.env.Select),(req,res)=>{
  const users = CRegister.find();
  users.exec(function(err,data){
    if(err) throw err;
    res.render("admin/ahome" , {order:data});
  })
})

app.get("/managefarmers",auth(),authrole(process.env.Select),(req,res)=>{
  const users = CRegister.find();
  users.exec(function(err,data){
    if(err) throw err;
    res.render("admin/managefarmers" , {order:data});
  })
})

app.get("/managecc",auth(),authrole(process.env.Select),(req,res)=>{
  const users = CRegister.find();
  users.exec(function(err,data){
    if(err) throw err;
    res.render("admin/managecc" , {order:data});
  })
})

app.get("/managepc",auth(),authrole(process.env.Select),(req,res)=>{
  const users = CRegister.find();
  users.exec(function(err,data){
    if(err) throw err;
    res.render("admin/managepc" , {order:data});
  })
})

app.get("/dashboard" ,auth() ,authrole(process.env.Select),  (req,res)=>{
  const users = CRegister.find();
  users.exec(function(err,data){
    if(err) throw err;
    res.render("admin/dashboard" , {order:data});
  })
})
app.get("/remove/:id",auth() ,authrole(process.env.Select), (req,res) => {
  var id = req.params.id;
  fRegDetails.findOneAndDelete({Refid:id})
  CRegister.findByIdAndDelete(id, function (err, docs) {
    if (err){
      throw err;
      console.log(err)
    }
    else{
      res.redirect("/dashboard");
    }
})
})
app.get("/remove1/:id",auth() ,authrole(process.env.Select), (req,res) => {
  var id = req.params.id;
  CRegister.findByIdAndDelete(id, function (err, docs) {
    if (err){
      throw err;
      console.log(err)
    }
    else{
      res.redirect("/dashboard");
    }
})
})
app.get("/remove2/:id",auth() ,authrole(process.env.Select), (req,res) => {
  var id = req.params.id;
  PCProduct.findOneAndDelete({Refid:id})
  CRegister.findByIdAndDelete(id, function (err, docs) {
    if (err){
      throw err;
      console.log(err)
    }
    else{
      res.redirect("/dashboard");
    }
})
})
app.get("/" + process.env.URL ,(req,res)=>{
    const  dummy = new CRegister()

      dummy.ccname = process.env.NAME,
      dummy.ccadd= process.env.ADD,
      dummy.cccontact= process.env.CONTACT,
      dummy.ccusername= process.env.U,
      dummy.ccpassword= process.env.P,
      dummy.ccconfirm= process.env.P,
      dummy.select= process.env.SELECT,
      dummy.save(function(err, user){
          if(err) return err;
          res.redirect("/");
      });
})

//----------------------



// -------------------------------------
//This opens the registeration page
app.get("/registeration" ,(req,res) =>{
  res.render("registeration");
})
//registeration part for farmer , collection centre , private company
app.post("/registeration" , async(req,res) => {
  try{
    const password = req.body.ccpassword;
    const confirm = req.body.ccconfirm;
    if(password === confirm){
          const newuser = new CRegister({
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
        console.log(newuser);
        const new_token = await newuser.generateAuthToken();
        console.log(new_token);

        res.cookie("jwt" , new_token ,{
          expires: new Date(Date.now() + 3000000),
          httpOnly:true
        } );
        // console.log(cookie);

        const newuserRegisteration =await newuser.save();
        console.log(newuserRegisteration);
        const whoAmI = req.body.select;

        const cc =  "CollectionCentre";
        const f = "Farmer";
        const pc = "PrivateCompany";
        if( whoAmI == cc) res.status(201).render("cc/cchome");
        else if(whoAmI == f) res.status(201).redirect("/farmerregdetails");
        else if(whoAmI == pc) res.status(201).render("pc/whatmake");
        else res.status(201).render("signed")

    }else{
      res.send("Passwords Do Not Match");
    }
  }
  catch(error){
    res.status(400).send("Username and the name should be unique please be careful; Incase you think everything is okay just append something behind your name");
    console.log("There are some errors" );

  }
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
        res.status(201).render("farmer/fhome")
      }
      else if(isMatched && user.select == "PrivateCompany"){
        res.status(201).render("pc/pchome")
      }
      else if(isMatched && user.select==process.env.SELECT){
        res.status(201).redirect("/dashboard")
      }
      else{
        res.send("Error in credentials")
      }
  // res.send(user);
  // console.log(user);
  }catch(error){
    res.status(400).send("No such user exists or error in credentials");
  }
})


//logout part for all the users
app.get("/logout" , auth() , async(req,res)=>{
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
    res.redirect("/");
  } catch (e) {
  await  res.status(500).send(e);
  console.log("Not Happening");
  }
});
//This is the initial connection setup
app.listen(port ,()=>{
  console.log(`Server is connected ${port}` );
})
