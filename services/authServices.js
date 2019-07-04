import userServices from "../services/userServices";
import blacklistServices from "../services/blacklistServices";



// function for authenticating user from HTTP Header
const authorizedUser = async (root, args, context, info) =>
{
    //return 'info@algorithmus.in';
    //console.log(`context : ${JSON.stringify(context)}`);

    let token = context.token;    
    //console.log(`token : ${token}`);
 
    // check whether token is blacklisted or not
    let blacklistedToken = await blacklistServices.isBlacklisted(token);    
    
    if(blacklistedToken)
        throw new Error("Unauthorized. Please login.");
    
    let email = await userServices.requestUser(token);
    //console.log(`email : ${email}`);
    
    return email;
}



// resolver function for query
const loggedInUser = async (root, args, context, info) =>
{
    //console.log(`context : ${JSON.stringify(context)}`);

    let token = context.token;    
    //console.log(`token : ${token}`);
 
    // check whether token is blacklisted or not
    let blacklistedToken = await blacklistServices.isBlacklisted(token);    
    
    if(blacklistedToken)
        throw new Error("Unauthorized. Please login.");
    
    let email = await userServices.requestUser(token);
    //console.log(`email : ${email}`);

    let user = await userServices.userDetails({EMAIL : email});            
    
    return user[0];
}



// resolver function for mutation localSignup
const localSignUp = async (root, args, context, info) =>
{
    let token = await userServices.localUserRegistration(args);            
    return token;
}


// resolver function for mutation localLogin
const localLogin = async (root, args, context, info) =>
{
    let token = await userServices.localUserLogin(args);            
    return token;
}


// resolver function for mutation localLogout
const localLogout = async (root, args, context, info) =>
{
    //console.log(`context : ${JSON.stringify(context)}`);

    let token = context.token;
    //console.log(`token : ${token}`);

    // add the token to blacklist
    let blacklistedToken = await blacklistServices.blacklistToken(token);    

    if(blacklistedToken)
        return "Successfully Logged Out."
    else
        throw new Error("Error while logging out.");   
}


module.exports = {
    localSignUp,
    localLogin,
    localLogout,
    loggedInUser,
    authorizedUser
}
