import dbServices from '../services/dbServices';
import { authorizedUser } from "../services/authServices";

import {
    companiesDDLQuery, 
    employeesDDLQuery,
    PrioritiesDDLQuery,
    DepartmentsDDLQuery,
    CategoriesDDLQuery,
    categoryCompaniesDDLQuery,
    categoryCompanyDepartmentsDDLQuery,
    CitiesDDLQuery,
    employeeEmailsDDLQuery
} from '../common/sqlQueries';

let loggedInUser = "";

// Resolver function for query populateDDL(input) : [DDL]
const populateDDL = async (root, args, context, info) =>
{
    try 
    {
        // Check for authorized user
        loggedInUser = await authorizedUser(root, args, context, info);

        let ddlName = args.ddlName;
        
        let ddlQuery;
        
        if(typeof ddlName === 'undefined' || ddlName == null || ddlName.trim().length == 0)
            throw new Error("DDL Name is required.");

        ddlName = ddlName.trim().toUpperCase();
    
        // Placeholders for prepared query
        let placeHolders = args.paraArray || [];

        // Get ddl query for request ddl
        switch (ddlName) {
            case 'COMPANIES':
                ddlQuery = companiesDDLQuery;                
                break;
                
            case 'EMPLOYEES':
                ddlQuery = employeesDDLQuery;                
                break;

            case 'PRIORITIES':
                ddlQuery = PrioritiesDDLQuery;                
                break;

            case 'DEPARTMENTS':
                ddlQuery = DepartmentsDDLQuery;                
                break;

            case 'CATEGORIES':
                ddlQuery = CategoriesDDLQuery;                
                break;                

            case 'CATCOMPANIES':
                ddlQuery = categoryCompaniesDDLQuery;                
                break;                

            case 'COMPDEPARTMENTS':
                ddlQuery = categoryCompanyDepartmentsDDLQuery;                
                break;                

            case 'CITY':
                ddlQuery = CitiesDDLQuery;                
                break;                

            case 'EMPEMAILS':
                ddlQuery = employeeEmailsDDLQuery;                
                break;                

            default:
                throw new Error("DDL Query not found.");
                break;
        }
            
        // Use database service to get table data
        let result = await dbServices.getTableData(ddlQuery, placeHolders) ;

        return result;
            
    } 
    catch (error) 
    {
        return error;    
    }

}


module.exports = {
    populateDDL
};