// Import Section
import ddlServices from "../../services/ddlServices";


// Resolvers
const resolvers = 
{
    Query: 
    {
        // Resolver for populateDDL(input) : [DDL]
        populateDDL : ddlServices.populateDDL
    }

};



// Export the resolvers
module.exports = resolvers;