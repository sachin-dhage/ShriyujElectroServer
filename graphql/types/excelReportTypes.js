
// Excel Report Types
const typeDefs = `

    # Query Type
    type Query
    {
        exportToExcel
        (
            ReportType    :   [ExcelTypes!]!,
            ParamArray    :   [[String]!]!,
            ReportName    :   String!
        )   :   String
    }

`;

// Export the typeDefs
module.exports = typeDefs;

