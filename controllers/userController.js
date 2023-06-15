// import model in usercontroller.js file
const users = require('../model/userSchema')
// import json webtoken
const jwt = require('jsonwebtoken')

// define and export logic to resolve different http client request

// register
exports.register = async (req,res)=>{
    // register logic
    console.log(req.body);
    // get data send by front end
    const {username,acno,password}=req.body
    if(!username || !acno || !password){
        res.status(403).json("All inputs are required")
    }    
    // check user is exists or not
    try{
        const preuser = await users.findOne({acno})
       if(preuser){
            res.status(406).json("User already Exist")
       }
       else{
        // add user to db
        const newuser = new users({
            username,
            password,
            acno,
            balance:5000,
            transactions:[]
        })
        // to save new user to db
        await newuser.save()
        res.status(200).json(newuser)
       } 
    }
    catch(error){
        res.status(401).json(error)
    }
}

// login

exports.login=async (req,res)=>{
    // get req body
    const {acno,password}=req.body
    try{
        // check acno and password in db
        const preuser=await users.findOne({acno,password})
        // check preuser or not
        if(preuser){
            // generate token ,, as login is sucessfull
            const token = jwt.sign({
                loginAcno:acno
            },"supersecretkey12345")
            res.status(200).json({preuser,token})
        }
        else{
            res.status(404).json("Invalid account number or password")
        }
    }
    catch(error){
        res.status(401).json(error)
    }
}

// get balance
exports.getbalance = async(req,res)=>{
    let acno = req.params.acno
    try{
    // find acno from user collection
    const preuser= await users.findOne({acno})
    if(preuser){
        res.status(200).json(preuser.balance)
    }
    else{
        res.status(404).json("Invalid account number")
    }

    }
    catch(error){
        res.status(401).json(error)
    }
}

// transfer funtion
exports.transfer = async (req,res)=>{
    console.log("inside transfer logic");
    // logic
    // get body fromreq, credid acno, amt , pswd
    const {creditAcno,creditAmount,pswd}=req.body
    // convert credit amount to number
    let amt = Number(creditAmount)
    const {debitAcno} = req 
    console.log(debitAcno);
    try {
    // check debitAcno is avalilable in mongodb
    const debitUserDetails = await users.findOne({acno:debitAcno, password:pswd})
    console.log(debitUserDetails);
    // get credit acno details from mongo db
    const creditUserDetails = await users.findOne({acno:creditAcno})
    console.log(creditUserDetails);

    if(debitAcno != creditAcno){
        if(debitUserDetails && creditUserDetails)
        // check sufficient balance in debit user account
        if(debitUserDetails.balance>=creditAmount){
            // perform transfer
            // debit cedit amount from debituserdetails
            debitUserDetails.balance-=amt
            // add debit transactions to debit user details
            debitUserDetails.transactions.push({
                transaction_type:"DEBIT",amount:creditAmount,fromAcno:debitAcno,toAcno:creditAcno
            })
            // save debituserdetails in mongodb
            await debitUserDetails.save()
            // credit credit amount to acredit user
            creditUserDetails.balance+=amt
            // add credit details to transaction
            creditUserDetails.transactions.push({
                transaction_type:"CREDIT",amount:creditAmount,fromAcno:debitAcno,toAcno:creditAcno
            })
            // save in mongodb
            await creditUserDetails.save()
            res.status(200).json("Fund transfer successfully")
        }
        else{
            // insufficient balance
            res.status(406).json("Insufficient balance")
        }

        else{
            res.status(406).json("Invalid credit or debit details")
        }
    } 
    else{
        res.status(406).json("Operation Denied !!! Self Transaction Not Allowed")
    }
    }
    catch (error) {
        res.status(401).json(error)
    }
  
}

// getTransactions()
exports.getTransactions=async (req,res)=>{
    // get acno from debit acno
    let acno = req.debitAcno
    // check acno in mongo db
    try{
        const preuser= await users.findOne({acno})
        res.status(200).json(preuser.transactions)
    }
    catch(error){
        res.status(401).json(error)
    }
}


// deleteMyacno
exports.deleteMyAcno = async (req,res)=>{
    // get acno from request
    let acno = req.debitAcno
    // remove acno from database
    try{
        await users.deleteOne({acno})
        res.status(200).json("Removed succesfully")
    }
    catch(error){
        res.status(401).json(error)
    }
}

