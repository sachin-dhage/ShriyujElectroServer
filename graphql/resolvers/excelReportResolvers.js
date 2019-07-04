// Import Section
import excelReportServices from "../../services/excelReportServices";


// Resolvers
const resolvers = 
{
    Query: 
    {
        // Resolver for exportToExcel(input) : String
        exportToExcel : excelReportServices.exportToExcel
    }

};



// Export the resolvers
module.exports = resolvers;