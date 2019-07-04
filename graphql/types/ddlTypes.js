
const typeDefs = `

    # Output Type
    type DDL
    {
        CODE    :   String,
        DESC    :   String
    }

    # Query Type
    type Query
    {
        populateDDL
        (
            ddlName     :   DDLTypes!,
            paraArray   :   [String]!
        )   :   [DDL]
    }
`;

module.exports = typeDefs;

