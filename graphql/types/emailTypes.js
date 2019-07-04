import { gql } from "apollo-server";


// Email Type
const typeDefs = gql`

    # Input Type
    input EmailsIp
    {
        MAILID	    :	String,
        MAIL_TYPE	:	String,
        TYPE_ID	    :	String,
        MAILFROM	:	String,
        MAILTO		:	String,
        MAILCC		:	String,
        MAILBCC		:	String,
        MAILSUB		:	String,
        MAILBODY    :	String
    }

    # Mutation Type
    type Mutation
    {
        # Email Operations
        SendEmails
        (
            emails      : [EmailsIp!]!
        )   :   String       


    }

`;

// Export the typeDefs
module.exports = typeDefs;