# KAPS
Krishi Avashesh Prabandhan Seva

## Problem Statement
The project focuses on providing a potential solution to the issue of rising air pollution because of agricultural residue in India.
The web application functions as a portal for the 3 users where in; a farmer can request for a nearby collection centre to pickup the residue, a collection centre can process that residue so that it can be stored and a private company that can buy the available waste from the residue catalogue.
KAPS performs a function of an e-commerce website where the farmer is a vendor/manufacturer and the private company is the consumer.
## Tech Stack
**Frontend**
HTML5
CSS3
JavaScript

**Backend**
Node.js (Express.js)

**Database**
MongoDB

**Templating Language**
Ejs

## Local Setup
* Clone repository.
* Install Node Js from [https://nodejs.org/en/](https://nodejs.org/en/) .
* Setup MongoDB [https://www.mongodb.com/](https://www.mongodb.com/)
* Run npm install and npm run dev in the /backend folder.
* Go to https://localhost:3000 in your web browser.

## Project Structure
+---public
|   +---css
|   |       style.css
|   |       stylea.css
|   |       stylecc.css
|   |       stylef.css
|   |       stylepc.css
|   |       
|   \---images
|           Bagasse.jpg
|           beige-tiles.png
|           bg.png
|           Coconut Husk.jpg
|           Coconut Shells.jpg
|           collection.jpg
|           Cotton Stalk.jpg
|           farmer.png
|           image.png
|           image2.png
|           Jute Stalk.jpg
|           logo.png
|           private.jpg
|           Rice Husk.jpg
|           Rice Straw.jpg
|           Tea Stalk.jpg
|           Tobacco Stalk.jpg
|           Wheat Husk.jpg
|           Wheat Straw.jpg
|           
+---src
|   |   app.js
|   |   
|   +---data
|   |       crops.json
|   |       states.json
|   |       
|   +---db
|   |       conn.js
|   |       
|   +---middleware
|   |       auth.js
|   |       
|   \---models
|           biomass.js
|           ccregisters.js
|           FarmerReq.js
|           fregdetail.js
|           pcaddreq.js
|           pcproduct.js
|           prices.js
|           waste.js
|           
\---views
    |   ccreg.ejs
    |   contact.ejs
    |   ffreg.ejs
    |   income.ejs
    |   index.ejs
    |   login.ejs
    |   ppreg.ejs
    |   product.ejs
    |   registeration.ejs
    |   wastecollected.ejs
    |   whyus.ejs
    |   
    +---admin
    |       ahome.ejs
    |       managecc.ejs
    |       managefarmers.ejs
    |       managepc.ejs
    |       setprices.ejs
    |       
    +---cc
    |       biomass.ejs
    |       biomassadd.ejs
    |       biomassedit.ejs
    |       cchome.ejs
    |       ccprofile.ejs
    |       ccwasteDB.ejs
    |       farmerdate.ejs
    |       Farmerreq.ejs
    |       farmerwaste.ejs
    |       fcclosereq.ejs
    |       pcclosereq.ejs
    |       pcreq.ejs
    |       waste.ejs
    |       wasteDB.ejs
    |       
    +---farmer
    |       fclose.ejs
    |       fhome.ejs
    |       fpending.ejs
    |       fprofile.ejs
    |       fprofilecc.ejs
    |       fresiduecatalog.ejs
    |       invoice.ejs
    |       notifications.ejs
    |       reg-farmer-details.ejs
    |       requestpickup.ejs
    |       
    +---partials
    |       adminheader.ejs
    |       ccheader.ejs
    |       farmerheader.ejs
    |       mainheader.ejs
    |       pcheader.ejs
    |       
    \---pc
            pcAddReq.ejs
            pcclosed.ejs
            pchome.ejs
            pcpending.ejs
            pcprofile.ejs
            rawCatalog.ejs
            selectcc.ejs
            whatmake.ejs
