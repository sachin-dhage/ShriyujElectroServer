// Import section
import gpioPinStatusServices from "../../services/gpioPinStatusServices";


//Resolvers
const resolvers = 
{
    Query:
    {
        // Resolver for getPinStatus : [GPIOOp]
        getGPIOPinStatus : gpioPinStatusServices.getGPIOPinStatus
    },

    Mutation:
    {
        // Resolver for setPinStatus : [String]
        setGPIOPinStatus : gpioPinStatusServices.setGPIOPinStatus
    }
};


// Export schema
module.exports = resolvers;