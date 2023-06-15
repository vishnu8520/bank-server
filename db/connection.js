// define node app and mogodb  database connectivity


// impoer mangoose in connetctiom.js file
const mongoose=require('mongoose')

// to get connection string from .env file : process.env
const connectionString = process.env.DATABASE

//  - connect the node application with mongodb using the help of mongoose
mongoose.connect(connectionString,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>{
    console.log("MongoDB Atlas Connected Successfully");
}).catch(()=>{
    console.log("Error in MongoDB Connection");
})