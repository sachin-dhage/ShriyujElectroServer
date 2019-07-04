import { gql } from "apollo-server";


// Company Master Types
const typeDefs = gql`

    # Output Type
    type GPIOOp
    {
        GPIOPIN	:	String,
        STATUS	:	String
    }


    # Input Type
    input GPIOIp
    {
        GPIOPIN	:	String,
        STATUS	:	String
    }


    # Query Type
    type Query
    {
        # Get GPIO Pin Status
        getGPIOPinStatus
        (
            gpiopins	:	[String]
        ) : [GPIOOp]   

    }


    # Mutation Type
    type Mutation
    {
        # Set GPIO Pin Status
        setGPIOPinStatus
        (
            gpiopins    :  [GPIOIp!]!
        )   :   [GPIOOp]
    }

`;


// Export the typeDefs
module.exports = typeDefs;