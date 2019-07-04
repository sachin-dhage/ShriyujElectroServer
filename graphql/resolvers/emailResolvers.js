// Import Section
import emailServices from "../../services/emailServices";


// Resolvers
const resolvers = 
{

    Mutation:
    {
        // Resolver for SendEmails(input) : String
        SendEmails : emailServices.SendEmails

    }
};



// Export the resolvers
module.exports = resolvers;