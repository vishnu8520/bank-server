// define application specific middleware


const appmiddleware = (req,res,next)=>{
    console.log("Application Specific Middleware");
    next()
}

module.exports={
    appmiddleware
}