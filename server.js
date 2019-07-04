// Import section
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import bodyParser from "body-parser";
import cors from 'cors';
import multer from 'multer';
import sysDateTime from './services/dateTimeServices';
//import documentsServices from "./services/documentServices";
import requestIP from 'request-ip';
//import geoip from 'geoip-lite';
//import iplocation from 'iplocation';
//import fetch from "node-fetch";


// Import GraphQL types
import graphQLTypes from './graphql/types';

// Import GraphQL resolvers
import graphQLResolvers from './graphql/resolvers';

//console.log(graphQLTypes);

// Set the port number
const PORT = {port : process.env.PORT || 3401};

// Set the end point 
const PATH = "/shriyuj";

// Initialize the web server
const webServer = express();


// add and configure body-parser middleware
webServer.use(bodyParser.urlencoded({extended : true}));
webServer.use(bodyParser.json());

//Restrict the client-origin for security reasons.
//server.use('*', cors({ origin: 'http://localhost:3000' }));
webServer.use(cors());

// simple middleware function
webServer.use((req, res, next)=>{
    console.log("Request received at : " + sysDateTime.sysdate_yyyymmdd() + "  "+ sysDateTime.systime_hh24mmss());  
    next();
});


// middleware for user ip tracking
webServer.use(async (req, res, next)=>{
    let clientIp = requestIP.getClientIp(req); 
    console.log(`Request received from : ${clientIp}`);  

    /*iplocation(clientIp, function (error, loc) {
        console.log(`Location : ${JSON.stringify(loc)}`);  
    }); */

    /* let ipresp = await fetch(`https://ipapi.co/157.33.192.133/json/`);
    let respjson = await ipresp.json();
    console.log(`Location : ${JSON.stringify(respjson)}`); */
    

    next();
});


// Use multer middleware to read the files from multipart-request
// Use memory storage
webServer.use(multer({
    storage: multer.memoryStorage()
}).any()); 


// Initialize the graphql server
const graphQLServer = new ApolloServer({
    typeDefs : graphQLTypes,
    resolvers : graphQLResolvers,
    context: async ({ req, res }) => {

        // get the user token from the header
        let token = req.headers.authorization || '';
        
        // get the uploaded files from the request
        let files = req.files || [];

        // add the token & files to the context
        // add response object to context
        return { token, files, res};

    },
    introspection: true,
    playground: true  ,
    uploads : false     // This will disable apollo-upload module inorder to use multer
      
});


graphQLServer.applyMiddleware({
    app: webServer, 
    path:PATH
});

webServer.listen( PORT, () => {
    console.log(`GraphQL Server is now running on http://localhost:${PORT.port}${PATH}`);
    console.log(`Go to http://localhost:${PORT.port}${PATH} to run queries!`);
    console.log('------------------------------------------------------');
  });
