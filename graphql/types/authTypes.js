import { gql } from "apollo-server";


const typeDefs = gql`

    type User
    {
        FIRST_NAME   :  String,
        LAST_NAME    :  String,
        EMAIL        :  String
    }

    type Query
    {
        loggedInUser : User 
    }

    type Mutation
    {
        # Register user locally
        localSignUp(
            FIRST_NAME   :  String!,
            LAST_NAME    :  String,
            EMAIL        :  String!,
            PASSWORD     :  String!
        ) : String

        # Login user locally
        localLogin(
            EMAIL        :  String!,
            PASSWORD     :  String!
        ) : String

        # Logout user locally
        localLogout : String
    }
`;


// Export typeDefs
module.exports = typeDefs;