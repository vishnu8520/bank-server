// router specific middleware
// define the logic for user login or not
const jwt = require('jsonwebtoken')

const logMiddleware = (req,res,next)=>{
    console.log("Router Specific Middleware");
    // get token
    const token= req.headers['access-token']
   try { // verify token
    const {loginAcno} =jwt.verify(token,"supersecretkey12345")
    console.log(loginAcno);
    // pass login acno to req
    req.debitAcno=loginAcno
    next()}
    catch{
        res.status(401).json("please log in")
    }
}
module.exports={
    logMiddleware
}
