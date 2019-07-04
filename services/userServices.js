// Import section
import dbServices from '../services/dbServices';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';

import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {APP_SECRET} from '../config/util';

import {
    searchUsersQuery
} from '../common/sqlQueries';

// function for registering user locally
const localUserRegistration = async (user) => 
{
    try 
    {      
        // Validation 
        let validationObject = {};

        validations.checkNull("EMAIL", user.EMAIL, "Email is required", validationObject);
        validations.checkNull("PASSWORD", user.PASSWORD, "Password is required", validationObject);

        if(Object.keys(validationObject).length != 0)
            throw new Error(JSON.stringify(validationObject));
        

        let token;           
        let insertStatements = [] ;

        let selectQuery = searchUsersQuery;

        // Placeholders for prepared query
        let placeHolders = [
                (typeof user.EMAIL !== 'undefined' && user.EMAIL.trim())  ?   user.EMAIL.trim()      : ''            
        ];

        // check to see if there is already an user with that email
        let existingUser = await dbServices.getTableData(selectQuery, placeHolders) ;


        if(existingUser.length != 0)
            throw new Error("This email is already taken.");


        // encrypt the password
        let passwordHash = await bcrypt.hash(user.PASSWORD, 12);
        user.PASSWORD = passwordHash;

        // create user
        // Get the insert statement
        user.CREATED_BY = user.EMAIL;
        user.CREATE_DATE = sysDateTime.sysdate_yyyymmdd();
        user.CREATE_TIME = sysDateTime.systime_hh24mmss();
        user.IS_DELETED = "N";
        
        let insertStatement = await dbServices.getInsertStatement("USERS", user);
        insertStatements.push(insertStatement);
        
        // Use db service to execute DML transactions
        let affectedRecords = await dbServices.executeDMLTransactions(insertStatements);

        // create the jwt
        if(affectedRecords != 0)
        {
            token = jwt.sign({ email: user.EMAIL }, APP_SECRET, { expiresIn : "1d"});
            return token;
        }
        else
            throw new Error("Error while registering.");

    } 
    catch (error) 
    {
        throw error;        
    }

}


// function for logging in user locally
const localUserLogin = async (user) => 
{
    try 
    {
        // Validation 
        let validationObject = {};

        validations.checkNull("EMAIL", user.EMAIL, "Email is required", validationObject);
        validations.checkNull("PASSWORD", user.PASSWORD, "Password is required", validationObject);

        if(Object.keys(validationObject).length != 0)
            throw new Error(JSON.stringify(validationObject));


        let selectQuery = searchUsersQuery;

        // Placeholders for prepared query
        let placeHolders = [
                (typeof user.EMAIL !== 'undefined' && user.EMAIL.trim())  ?   user.EMAIL.trim()      : ''            
        ];

        // check to see if there is already an user with that email
        let existingUser = await dbServices.getTableData(selectQuery, placeHolders) ;

        if (existingUser.length == 0) {
            //console.log(`User Not Found with email id ${user.email}`);
            throw new Error('Incorrect email id.');
        }

        let passwordMatches = await isValidPassword(existingUser[0].PASSWORD, user.PASSWORD) ;
        
        if(!passwordMatches){
            //console.log('Incorrect Password');
            throw new Error('Incorrect password.');
        }

        // User and password both match, return user
       // return existingUser;

        // create the jwt
        let token = jwt.sign({ email: user.EMAIL }, APP_SECRET, { expiresIn : "1d"});

        
        return token;

    } catch (error) {
        throw error;        
    }   

}


// checking if password is valid
const isValidPassword = async (savedPassword, inputPassword) => 
{
    //console.log(`savedPassword : ${savedPassword}`);
    //console.log(`inputPassword : ${inputPassword}`);
    
    let match =  await bcrypt.compare(inputPassword, savedPassword);
    //console.log(`Password Match : ${match}`);

    return match;
    
};


// Checking if user id is valid
const requestUser = async (token) =>
{
    if (token) 
    {
      token = token.replace('Bearer', '');
      token = token.trim();
      let { email } = jwt.verify(token, APP_SECRET);
      return email;
    }
  
    throw new Error('Not authenticated');
}
  

// function for logging in user locally
const userDetails = async (user) => 
{
    try 
    {
        let selectQuery = searchUsersQuery;

        // Placeholders for prepared query
        let placeHolders = [
                (typeof user.EMAIL !== 'undefined' && user.EMAIL.trim())  ?   user.EMAIL.trim()      : ''            
        ];

        // check to see if there is already an user with that email
        let existingUser = await dbServices.getTableData(selectQuery, placeHolders) ;

        if (existingUser.length == 0) {
            //console.log(`User Not Found with email id ${user.email}`);
            throw new Error('Incorrect email id.');
        }

        // User and password both match, return user
       return existingUser;


    } catch (error) {
        throw error;        
    }   

}


module.exports = {
    localUserRegistration,
    localUserLogin,
    requestUser,
    userDetails
}