import dbServices from '../services/dbServices';
import sysDateTime from '../services/dateTimeServices';

import jwt from 'jsonwebtoken';
import {APP_SECRET} from '../config/util';


import {
    searchBlacklistQuery
} from '../common/sqlQueries';

// function for blacklisting token
const blacklistToken = async (token) => 
{
    try 
    {
        let insertStatements = [] ;

        if (token) 
        {
            token = token.replace('Bearer', '');
            token = token.trim();
            jwt.verify(token, APP_SECRET);
        }
        else
            throw new Error('Not authenticated');    


        let selectQuery = searchBlacklistQuery;

        // Placeholders for prepared query
        let placeHolders = [
                (typeof token !== 'undefined' && token.trim())  ?   token.trim()      : ''            
        ];

        
        // check to see if token is already blacklisted
        let existingToekn = await dbServices.getTableData(selectQuery, placeHolders) ;
            
        if(existingToekn.length != 0)
            return token;


        // blacklist token
        // Get the insert statement
        let dataJSON = {
            "TOKEN" : token,
            "CREATE_DATE" : sysDateTime.sysdate_yyyymmdd(),
            "CREATE_TIME" : sysDateTime.systime_hh24mmss()
        }
        let insertStatement = await dbServices.getInsertStatement("BLACKLIST", dataJSON);
        insertStatements.push(insertStatement);
        
        // Use db service to execute DML transactions
        let affectedRecords = await dbServices.executeDMLTransactions(insertStatements);

        if(affectedRecords !=0 )
            return token;
        else   
            throw new Error("Error while blackilisting token");    
    } 
    catch (error) 
    {
        throw error;
    }
}



// function to check blacklisted token
const isBlacklisted = async (token) => 
{
    try 
    {
        if (token) 
        {
            token = token.replace('Bearer', '');
            token = token.trim();
            jwt.verify(token, APP_SECRET);
        }
        else
            throw new Error('Not authenticated');    


        let selectQuery = searchBlacklistQuery;

        // Placeholders for prepared query
        let placeHolders = [
                (typeof token !== 'undefined' && token.trim())  ?   token.trim()      : ''            
        ];

        
        // check to see if token is already blacklisted
        let blacklistedToekn = await dbServices.getTableData(selectQuery, placeHolders) ;
        
        if(blacklistedToekn.length == 0)
            return false;
        else    
            return true;    

    } 
    catch (error) 
    {
        throw error;
    }
}


module.exports = {
    isBlacklisted,
    blacklistToken
}