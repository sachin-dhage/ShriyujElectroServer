// Import section
import authServices from "../../services/authServices";


//Resolvers
const resolvers = 
{
    Query:
    {
        loggedInUser : authServices.loggedInUser
    },

    Mutation:
    {
        // Resolver for localSignUp : String
        localSignUp : authServices.localSignUp,

        // Resolver for localLogin : String
        localLogin : authServices.localLogin,

        // Resolver for localLogout : String
        localLogout : authServices.localLogout

    }
};


// Export schema
module.exports = resolvers;