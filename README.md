# KAPS
Krishi Avashesh Prabandhan Seva

## Problem Statement
The project focuses on providing a potential solution to the issue of rising air pollution because of agricultural residue in India.
The web application functions as a portal for the 3 users where in; a farmer can request for a nearby collection centre to pickup the residue, a collection centre can process that residue so that it can be stored and a private company that can buy the available waste from the residue catalogue.
KAPS performs a function of an e-commerce website where the farmer is a vendor/manufacturer and the private company is the consumer.
## Tech Stack
**Frontend** \
HTML5
CSS3
JavaScript

**Backend**\
Node.js (Express.js)

**Database**\
MongoDB

**Templating Language**\
Ejs

## Local Setup
* Clone repository.
* Install Node Js from [https://nodejs.org/en/](https://nodejs.org/en/) .
* Setup MongoDB [https://www.mongodb.com/](https://www.mongodb.com/)
* Please ensure you download and install MongoDB Compass
* Open MongoDB compass tool
  * The DB_URL is mentioned in the .env file
  * The sample database is present in Database JSON folder.
  * All of the collections present inside the database(mentioned in .env file) can be imported to MongoDB Compass.
  * Click the Add Data dropdown and select Import File.
  * Select the location of the source data file under Select File.
  * Choose the appropriate file type which is JSON.
  * Click Import and data will be imported.
* Run npm install in the /backend folder.
* After all the installations are successful hit, npm run dev on the command prompt/terminal in the /backend folder.
* Go to https://localhost:3000 in your web browser. 


## Website Demo
**Home Page** \
\
![Home](https://user-images.githubusercontent.com/53380110/116394569-b8fe9f00-a840-11eb-89c8-694a72873b34.jpg)
**Signup** \
\
Token is stored as a cookie on the client side\
Token valid for 50 minutes\
Every privileged request is authenticated on the server side\
Client side cookie is set to expire after 50 minutes\
\
![Signup](https://user-images.githubusercontent.com/53380110/116394667-daf82180-a840-11eb-925c-a76d68f80260.jpg)
**Farmer Add request**\
\
Farmer can see only those crops residues which are registered.\
\
![AddRF](https://user-images.githubusercontent.com/53380110/116394743-eea38800-a840-11eb-95bd-af0e953b0173.png)
**Farmer Pending Requests**\
\
This shows the Pending requests of farmer\
\
![FPend](https://user-images.githubusercontent.com/53380110/116394831-02e78500-a841-11eb-8e1e-6178fe60b2b5.jpg)
\
**Collection Center's View of Farmers Requests**\
\
When a request arrives the collection center approves it, marks the order in transit when it is on the way, Gives the waste information and finally when it pays to the farmer the request is moved to the Completed Requests.\
\
![CFR](https://user-images.githubusercontent.com/53380110/116394882-0f6bdd80-a841-11eb-8926-79a5ac717f1d.jpg)
**Collection Center Approves Farmer's Requests**\
\
The collection center provides the pickup date.
\
![ApproveF](https://user-images.githubusercontent.com/53380110/116394938-1f83bd00-a841-11eb-9972-85f1a9c019b1.jpg)
**Collection Center Measures Waste of Farmer's Request**\
\
![WasteF](https://user-images.githubusercontent.com/53380110/116394998-2f030600-a841-11eb-84c6-6dfdcf855559.jpg)
**Collection Center Waste Database Gets Auto Update**\
\
![Waste](https://user-images.githubusercontent.com/53380110/116395008-31fdf680-a841-11eb-90db-f782dcff1353.jpg)
**Private Company Views Raw Catalogue**\
\
![RC](https://user-images.githubusercontent.com/53380110/116395073-47732080-a841-11eb-93a0-53eafdb6b4de.jpg)
**Private Company Add Request**\
\
![PAddR](https://user-images.githubusercontent.com/53380110/116395122-54900f80-a841-11eb-8121-802b37c1f259.png)
**Private Company Pending Requests**\
\
![PCpend](https://user-images.githubusercontent.com/53380110/116395129-5659d300-a841-11eb-9624-8233411a2a5c.jpg)
**Collection Center Views Private Company's Request**\
\
When the request arrives the collection center approves it and when the payment arrives the collection center marks the request paid and it moves to completed request. Also the waste database gets auto updated.\
\
![CCP](https://user-images.githubusercontent.com/53380110/116395183-6d002a00-a841-11eb-8d61-5c4cea292bd2.jpg)
**Admin**\
\
Admin's Role is to manage the farmers, collection centers, and private companies. Also the Admin sets the prices.\
\
![AdminSetp](https://user-images.githubusercontent.com/53380110/116395195-712c4780-a841-11eb-825a-88422b26d7a3.jpg)
**See Users**\
\
This shows the number of collection centers registered in a particular state. Similar arrangement is made for farmers and private company.\
\
![CCDet](https://user-images.githubusercontent.com/53380110/116395254-84d7ae00-a841-11eb-8674-d08af3c8b3aa.jpg)
**See Contribution**\
\
This shows the products made by private companies.
Similarly the Our Contribution Dropdown shows the amount of Co2 that was prevented to be released in the atmosphere by treating it properly, the amount of revenue generated by farmers, the amount earned by the farmers.\
\
![Product](https://user-images.githubusercontent.com/53380110/116395264-886b3500-a841-11eb-8f29-b24670fdda16.jpg)
