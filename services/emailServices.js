// Import section
import nodemailer from 'nodemailer';
import dbServices from '../services/dbServices';
import sysDateTime from '../services/dateTimeServices';
import validations from '../common/validations';
import { authorizedUser } from "../services/authServices";
import emailTemplateServices from "./emailTemplateServices";

let loggedInUser = "";


/**
 * Create transporter object
 * SMTP or other configurations 
 */
/*const transporter = nodemailer.createTransport({
    //host : "cp-48.webhostbox.net",
    //port : "465",
    //secure: true, 
    service : 'gmail',                        // email service
    auth : {
        user : 'shekhartransportservice@gmail.com',            // email id
        pass : 'company1@'                                  // password
    }    
});*/



const transporter = nodemailer.createTransport({
    host : "cp-48.webhostbox.net",
    port : "465",
    secure: true, 
    auth : {
        user : 'test@discriminant.in',            // email id
        pass : 'test@discriminant0.0'             // password
    }    
});



// Resolver function for mutation SendEmails(input):String
const SendEmails = async (root, args, context, info) =>
{
    try 
    {  
        
        // Check for authorized user
        loggedInUser = await authorizedUser(root, args, context, info);
        let affectedRecords = 0;

        // Validate input data
        let emails = await validateEmailData(args.emails);

        // if all goes well, then create records
        //affectedRecords = await createEmails(emails);

        // if all goes well, then send emails
        affectedRecords = await sendEmails(emails, context);

        return affectedRecords;        

    } 
    catch (error) 
    {
        return error;    
    }

}


// Validation funtion for creation
const validateEmailData = async (emails) =>
{
    try 
    {
        let validationObjects = {};

        for(let i = 0; i < emails.length; i++)
        {
            let validationObject = {};

            validations.checkNull("MAILFROM", emails[i].MAILFROM, "Email From is required", validationObject);
            validations.checkNull("MAILTO", emails[i].MAILTO, "Email To is required", validationObject);
            validations.checkNull("MAILBODY", emails[i].MAILBODY, "Email Body is required", validationObject);
            validations.checkNull("MAILSUB", emails[i].MAILSUB, "Email Subject is required", validationObject);

            validations.checkMaxLength("MAILTYPE", emails[i].MAIL_TYPE, 120, "Length of Email Type should be less than or equal to 120 characters", validationObject);
            validations.checkMaxLength("TYPEID", emails[i].TYPE_ID, 120, "Length of Type ID should be less than or equal to 120 characters", validationObject);
            validations.checkMaxLength("MAILFROM", emails[i].MAILFROM, 128, "Length of Email From should be less than or equal to 128 characters", validationObject);
            validations.checkMaxLength("MAILTO", emails[i].MAILTO, 1000, "Length of Email To should be less than or equal to 1000 characters", validationObject);            
            validations.checkMaxLength("MAILCC", emails[i].MAILCC, 1000, "Length of Email CC should be less than or equal to 1000 characters", validationObject);            
            validations.checkMaxLength("MAILBCC", emails[i].MAILBCC, 1000, "Length of Email BCC To should be less than or equal to 1000 characters", validationObject);            
            validations.checkMaxLength("MAILSUB", emails[i].MAILSUB, 500, "Length of Email Subject To should be less than or equal to 500 characters", validationObject);            

            emails[i].MAILTO.split(",").forEach(element => {
                validations.checkEmail("MAILTO", element.trim(), "Email id(s) are not valid", validationObject);    
            });

            emails[i].MAILCC||"".split(",").forEach(element => {
                validations.checkEmail("MAILCC", element.trim(), "Email id(s) are not valid", validationObject);    
            });

            emails[i].MAILBCC||"".split(",").forEach(element => {
                validations.checkEmail("MAILBCC", element.trim(), "Email id(s) are not valid", validationObject);    
            });

            if(Object.keys(validationObject).length != 0)
                validationObjects[i] = validationObject;

        }
        
        // if data is not valid, throw validation errors
        if(Object.keys(validationObjects).length != 0)
        {
            throw new Error(JSON.stringify(validationObjects));
        }
        else
        { 
            let nextNumber;
    
            // Get system date and time
            let curDate = sysDateTime.sysdate_yyyymmdd();
            let curTime = sysDateTime.systime_hh24mmss();

            for(let i = 0; i < emails.length; i++)
            {
                // Get number for emails id
                nextNumber = curDate + curTime + i;
                
                // Add auto-generated number as emails id
                emails[i].MAILID = nextNumber;

                // Add create params 
                emails[i].CREATED_BY = loggedInUser;
                emails[i].CREATE_DATE = curDate;
                emails[i].CREATE_TIME = curTime;
                emails[i].IS_DELETED = "N";
        
            }
        
            return emails;        
        }            
    } 
    catch (error) 
    {
        throw error;    
    }
}


// function for creating emails records
const createEmails = async (emails) =>
{
    try 
    {   
        let insertStatement;             
        let insertStatements = [] ;
        let dataJSON;
        let result;
        let affectedRecords = 0;

        for(let i = 0; i < emails.length; i++)
        {
            // form the data json
            //dataJSON = emails[i];
            dataJSON = {
                "MAILID"	    :	emails[i].MAILID,
                "MAILTYPE"	    :	emails[i].MAILTYPE,
                "TYPEID"	    :	emails[i].TYPEID,
                "MAILFROM"	    :	emails[i].MAILFROM,
                "MAILTO"		:	emails[i].MAILTO,
                "MAILCC"		:	emails[i].MAILCC,
                "MAILBCC"		:	emails[i].MAILBCC,
                "MAILSUB"		:	emails[i].MAILSUB,
                "MAILBODY"      :	emails[i].MAILBODY,
                "CREATED_BY"    :	emails[i].CREATED_BY,
                "CREATE_DATE"   :	emails[i].CREATE_DATE,
                "CREATE_TIME"   :	emails[i].CREATE_TIME,
                "IS_DELETED"    :	emails[i].IS_DELETED,
            }

            // Get the insert statement
            insertStatement = await dbServices.getInsertStatement("EMAILS", dataJSON);
            insertStatements.push(insertStatement);
            //console.log("insertStatement => ");  console.log(insertStatement);

        }

        // Use db service to execute DML transactions
        affectedRecords = await dbServices.executeDMLTransactions(insertStatements);

        return affectedRecords;        

    } 
    catch (error) 
    {
        return error;    
    }
}


// function for sending emails after email creation
const sendEmails = async (emails, context) =>
{
    try 
    {   
        let mailMessage, template, mailOptions, info; 
        let attachments = [], attachment;
        let files = context.files || [];
        let file;

        for(let i = 0; i < emails.length; i++)
        {
            
            mailMessage =  emails[i].MAILBODY;
            
            template = emailTemplateServices.emailTemplate(mailMessage);
            //template = `<b>${mailMessage}</b>`;
            
            if(files.length != 0)
            {
                for( let i = 0 ; i < files.length; i++)
                {
                    file = files[i];

                    attachment = {
                        content : file.buffer,
                        filename : file.originalname,
                        contentType : file.mimetype    
                    };

                    attachments.push(attachment);
                }        
            }

            mailOptions = {
                from : emails[i].MAILFROM,
                to : emails[i].MAILTO,
                cc : emails[i].MAILCC,  
                bcc : emails[i].MAILBCC,      
                subject : emails[i].MAILSUB,
                html : template,
                attachments : attachments
            };
    
    
            //info = await sendEmails(mailOptions); 
            //console.log(info);  

            // Send email using nodemailer sendMail() function
            info = await transporter.sendMail(mailOptions);  
            console.log("Email Response:=>> " + JSON.stringify(info));              
        }

        return emails.length;

    } 
    catch (error) 
    {
        throw error;    
    }
}


// Export the function module
module.exports = {
    SendEmails
};