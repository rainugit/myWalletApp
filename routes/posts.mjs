import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

import { TransactionModel,ResponseModel } from "../model/models.mjs";

const router = express.Router();

// the default route
router.get("/", async (req, res) => {
  console.log("Inside default root route");

  res.send("Nothing to see here").status(200);

});

//testing the sort option 
router.get("/:personid/:sortby", async (req, res) => {
  console.log("Inside personid route");

  let collection = await db.collection("transactions");

  let query = { personid: req.params.personid };

  const options = { sort: { transcreateddt: req.params.sortby } };

  let result = await collection.findOne(query, options);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// new user registration not needed as it will be done in firebase
router.post("/newuser",async(req,res)=> {
  console.log("Inside create user API");

  const personData = new PersonModel();

})

//new transaction
router.post("/transaction",  async( req,res) =>  {
  console.log("Inside create transaction");
  
  let collection = await db.collection("transactions");

  const result = new ResponseModel();

  const filter = { personid : req.body.personid};
  
  const options = { sort: { transcreateddt: -1 } };

  let BalanceObj;

  const myBal = await collection.findOne(filter,options);

  if(myBal && req.body.transtype=="Genesis"){
    result.status  = "Failure";
    result.message = "User record already available transaction type should be Debit or Credit";
    res.send(result).status(404);
    return;
  }
  else if (myBal && req.body.transtype!=="Genesis"){
    BalanceObj =myBal;
  }
  else 
  {
    if(req.body.transtype=="Genesis"){
      BalanceObj = {"balance":0}; 
    }
    else {  
      console.log("No record found for the user hence transaction should be genesis");
      result.status  = "Failure";
      result.message = "No record found for the user hence transaction should be genesis";
      res.send(result).status(404);
      return;
      }
  }
  

  //validate balance 
  const isBalanceSufficient = req.body.transtype=== "Credit" || req.body.transtype==="Genesis" || (req.body.transtype === 'Debit' && BalanceObj.balance >= req.body.transamt);
  
  console.log("Balance:"+ BalanceObj.balance+" trans:"+req.body.transtype+" transamount:"+ req.body.transamt);

  if(!isBalanceSufficient){
    result.status  = "Failure";
    result.message = "Insufficent balance";    
    res.send(result).status(200);
    return;
  }

  console.log("isBalanceSufficient:"+isBalanceSufficient);

  const transData = new TransactionModel();

  transData.personid  = req.body.personid;
  transData.transtype = req.body.transtype;
  transData.transamt  = req.body.transamt;
  transData.balance   = req.body.transtype === 'Debit' ? BalanceObj.balance - req.body.transamt : BalanceObj.balance + req.body.transamt;
  transData.activity  = req.body.activity;
  transData.transcreateddt = new Date().toISOString();
  
  const insertStatus = await db.collection("transactions").insertOne(transData);

  console.log("Insert status"+insertStatus);

  // update balance 
  // const personUpdate = {$set: { walletbalance: transData.balance , updateddt: new Date().toISOString() }};

  // console.log("update query "+personUpdate);

  // const updateStatus = await db.collection("Person").updateOne(PersonFilter,personUpdate);
  
  // console.log("Update status"+updateStatus);

  result.status  = "Success";
  result.message = "The transaction is successfully";
  result.walletbalance = transData.balance;

  res.send(result).status(200);

  console.log("end "+result);
});


export default router;
