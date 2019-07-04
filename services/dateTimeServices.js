//Import the date format module
import moment from 'moment';


// Get sysdate [yyyymmdd]
let sysdate_yyyymmdd = () => 
{

    // Get current timestamp
    let now = moment();
    //console.log(now.format("YYYYMMDD"));

    return now.format("YYYYMMDD");
    

}

// Get systime [HHMMss]
let systime_hh24mmss = () => 
{

    // Get current timestamp
    let now = moment();
    //console.log(now.format("HHmmss"));

    return now.format("HHmmss");
}

// Get systime [HHMMssSSS]
let systime_hh24mmssSSS = () => 
{

    // Get current timestamp
    let now = moment();
    //console.log(now.format("HHmmss"));

    return now.format("HHmmssSSS");
}


// Check date
let checkDate = (dateString, format) =>
{
    try 
    {        
        //let dateObj = moment("20181501", "YYYYMMDD").isValid();
        let isValidDate = moment(dateString, format).isValid();

        if(isValidDate) return true;
        else return false;
    } 
    catch (error) 
    {
        throw error;
    }
}

// Export
module.exports = {
    sysdate_yyyymmdd,
    systime_hh24mmss,
    systime_hh24mmssSSS,
    checkDate
};