// import  dotenv
// config() is for loding .env file into process.env
require('dotenv').config();
// import express
const express = require('express')
// import cors
const cors = require('cors')

// import database mongodb -- defined inn connetion .js
require('./db/connection')     

// import routeter
const router = require('./routes/router')

// import middleware
const middleware = require('./middleware/appMiddleware')


// create express server
const server = express()

// set up port number for server
const PORT = 3000 || process.env.PORT

// use cors amd json parser in server app
server.use(cors())
server.use(express.json())

// use middleware
server.use(middleware.appmiddleware)

// use router in server app
server.use(router)

// to resolve http request using express server
server.get('/',(req,res)=>{
    res.send(`<h1>bank server started</h1>`)
})



//run the server app in specified port
server.listen(PORT,()=>{
    console.log(`Bank Server started at port number ${PORT}`);
})
