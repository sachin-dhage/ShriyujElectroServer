// Import section
import dbServices from './dbServices';
import sysDateTime from './dateTimeServices';
import validations from '../common/validations';
import { authorizedUser } from "./authServices";

import { Gpio } from "onoff";

import {
    searchCompaniesQuery, 
    checkDuplicateCompaniesQuery,
    checkDuplicateCompanyPANQuery
} from '../common/sqlQueries';


let loggedInUser = "";


/**
 * Get GPIO Pin Status
 */
// Resolver function for query getGPIOPinStatus(input) : [GPIOOp]
const getGPIOPinStatus = async (root, args, context, info) =>
{
    try 
    {
        // Check for authorized user
        //loggedInUser = await authorizedUser(root, args, context, info);
        
        let gpiopin = "";
        let status = "";        
        let result = [];
        
        let gpiopins = args.gpiopins;

        for(let i = 0; i < gpiopins.length; i++)
        {
            console.log(`Getting GPIO Pin ${gpiopins[i]} status`);
            
            //Use GPIO pin as specified for output
            gpiopin = new Gpio(gpiopins[i], 'out');//.writeSync(1);

            // Get realtime status of GPIO Pin
            status = gpiopin.readSync() === 1 ? 'ON' : 'OFF';

            result.push({
                GPIOPIN	:	gpiopins[i],
                STATUS	:	status
            });
        }
    
        return result;        
    } 
    catch (error) 
    {
        return error;    
    }

}


/**
 * Set GPIO Pin Status
 */
// Resolver function for query setGPIOPinStatus(input) : [GPIOOp]
const setGPIOPinStatus = async (root, args, context, info) =>
{
    try 
    {
        // Check for authorized user
        //loggedInUser = await authorizedUser(root, args, context, info);
        
        let gpiopin = "";
        let status = "";
        let result = [];

        let gpiopins = args.gpiopins;
        
        for(let i = 0; i < gpiopins.length; i++)
        {            
            console.log(`Setting GPIO Pin ${gpiopins[i].GPIOPIN} to ${gpiopins[i].STATUS}`);

            //Use GPIO pin as specified for output
            gpiopin = new Gpio(gpiopins[i].GPIOPIN, 'out');//.writeSync(1);
            
            // If STATUS = ON the set pin status to HIGH else LOW
            status = gpiopins[i].STATUS == 'ON' ? Gpio.HIGH : Gpio.LOW;
            
            // Change the status
            gpiopin.writeSync(status);

            // Get realtime status of GPIO Pin
            status = gpiopin.readSync() === 1 ? 'ON' : 'OFF';

            result.push({
                GPIOPIN	:	gpiopins[i].GPIOPIN,
                STATUS	:	status
            });
        }

        return result;        
    } 
    catch (error) 
    {
        return error;    
    }

}


// Export functions
module.exports = {
    getGPIOPinStatus,
    setGPIOPinStatus
};