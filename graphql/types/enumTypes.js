// Enumerations
const typeDefs = `

    # Constants for Dropdowns
    enum DDLTypes
    {
        COMPANIES
        EMPLOYEES
        EMPEMAILS
        PRIORITIES
        DEPARTMENTS
        CATEGORIES
        CATCOMPANIES
        COMPDEPARTMENTS
        CITY
    }

    # Constants for Download Document Types
    enum DocumentTypes
    {
        TASK_REPORT
    }

    # Constants for Transaction Types
    enum TransactionTypes
    {
        CREATE
        UPDATE
        LOGICAL_DELETE
        PHYSICAL_DELETE
    }

    # Constants for PDF Report Types
    enum ReportTypes
    {
        TASK_REPORT
    }

    
    # Constants for Excel Report Types
    enum ExcelTypes
    {
        COMPANIES
        EMPLOYEES
        PRIORITIES
        DEPARTMENTS
        CATEGORIES
        CALENDARS
        TASKS
    }

`;


// Export typeDefs
module.exports = typeDefs;