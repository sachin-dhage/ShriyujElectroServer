// Import Section
import Excel from 'exceljs';
import dbServices from '../services/dbServices';
import { authorizedUser } from "../services/authServices";

import {
    exportCompaniesQuery, exportEmployeesQuery, exportPrioritiesQuery, exportDepartmentsQuery, exportCategoriesQuery, exportCalendarsQuery, exportTasksQuery
} from '../common/sqlQueries';

let loggedInUser = "";

// Function for getting excel data
const getReportData = async (reportType, paramArray) =>
{
    try 
    {
        let selectQuery;

        // Get report type
        //let reportType = args.ReportType;

        if(typeof reportType === 'undefined' || reportType == null || reportType.trim().length == 0)
            throw new Error("Report type required.");

        reportType = reportType.trim().toUpperCase();
    
        // Placeholders for prepared query
        //let placeHolders = args.ParamArray || [];
        let placeHolders = paramArray || [];

        // Get select query for requested report
        switch (reportType) {
            case 'COMPANIES':
                selectQuery = exportCompaniesQuery;                
                break;

            case 'EMPLOYEES':
                selectQuery = exportEmployeesQuery;                
                break;
        
            case 'PRIORITIES':
                selectQuery = exportPrioritiesQuery;                
                break;

            case 'DEPARTMENTS':
                selectQuery = exportDepartmentsQuery;                
                break;

            case 'CATEGORIES':
                selectQuery = exportCategoriesQuery;                
                break;

            case 'CALENDARS':
                selectQuery = exportCalendarsQuery;                
                break;

            case 'TASKS':
                selectQuery = exportTasksQuery;                
                break;

            default:
                throw new Error("Invalid report specified.");
                break;
        }
            
        // Use database service to get table data
        let result = await dbServices.getTableData(selectQuery, placeHolders) ;

        return result;

    } 
    catch (error) 
    {
        throw error;    
    }

}




// Resolver function for query exportToExcel(input) : String
const exportToExcel = async (root, args, context, info) => 
{
    try 
    {
        // Check for authorized user
        loggedInUser = await authorizedUser(root, args, context, info);

        // Get array of report types
        let reportTypes = args.ReportType || [];

        // Get array of parameters
        let paramArrays = args.ParamArray || [];

        // Check if parameters are provided for all reports 
        if(paramArrays.length < reportTypes.length)
        {
            throw new Error("Parameters should be provided for all reports.")            
        }

        // Get report file name
        let reportName = args.ReportName;

        // Get no of types of reports specified [ equivalent to no. of sheets in workbook ]
        let noOfSheets = reportTypes.length;

        // create workbook
        let workbook = new Excel.Workbook();
        let worksheet;

        for(let sheetNum = 0; sheetNum < noOfSheets; sheetNum++)
        {
            // add worksheet
            worksheet = workbook.addWorksheet(reportTypes[sheetNum]);

            //Get the report data
            let reportData = await getReportData(reportTypes[sheetNum], paramArrays[sheetNum]);
            //console.log(reportData);
            
            /*
            * Add column headers
            * Headers will be extracted from FIRST OBJECT of reportData array
            * That object needs to be manually inserted into reportData   
            */
            let columnsHeader = [];
            for (let Header in reportData[0]) {
                columnsHeader.push({ header: reportData[0][Header], key: Header })
            }

            /*
            * worksheet.columns = [
            * { header: 'Album', key: 'album'},
            * { header: 'Year', key: 'year'}
            *  ];
            */
            worksheet.columns = columnsHeader

            // Make the header BOLD
            worksheet.getRow(1).font = { size: 12, bold: true };

            // add row using keys
            //worksheet.addRow({album: "Taylor Swift", year: 2006});

            // add rows the dumb way
            //worksheet.addRow(["Fearless", 2008]);

            // add an array of rows
            // let rows = [
            //   ["Speak Now", 2010],
            //   {album: "Red", year: 2012}
            // ];


            // Calculate max size of content for each column
            let maxColumnSize = reportData.reduce((init,next)=>{
                Object.entries(next).forEach(element => {
                let lastValue = init[element[0]]||0
                let currentValue=0
                if(element[1]!==null){
                    currentValue=element[1].toString().length 
                }
                if(lastValue<currentValue)       
                    init[element[0]]=currentValue
                });
            return init
            },{});
        
            //console.log(maxColumnSize);

            // Auto-size columns
            worksheet.columns.forEach(column => {
                column.width = maxColumnSize[column.header];        
            });



            // As we are using FIRST OBJECT as HEADER, we are removing first object from DATA 
            reportData.shift();

            // Adding whole array as rows
            worksheet.addRows(reportData);

            // edit cells directly
            //worksheet.getCell('A6').value = "1989";
            //worksheet.getCell('B6').value = 2014;

            // Add Cell Borders
            worksheet.columns.forEach(column => {
                column.eachCell(function(cell, rowNumber) {
                    cell.border = {
                        top: {style:'thin'},
                        left: {style:'thin'},
                        bottom: {style:'thin'},
                        right: {style:'thin'}
                    }
                })
            });
        }

        // save workbook to disk
        /* workbook.xlsx.writeFile('taylor_swift.xlsx').then(function () {
            console.log("saved");
        });  */

        workbook.creator = loggedInUser;
        workbook.lastModifiedBy = loggedInUser;

        // save workbook to Buffer
        let bufferedDocument = await workbook.xlsx.writeBuffer();

        //console.log(bufferedDocument);

        /**
         * Block for sending file through HTTP Response starts
         */
        let mimetype = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        let filename = reportName + ".xlsx";
        let file = bufferedDocument; //await Buffer.from(bufferedDocument, "binary");
    
        console.log("Downloading excel file : "  + filename);
    
        
        // Set response header 
        await context.res.setHeader("Content-disposition", "attachment; filename="+filename);
        await context.res.setHeader("Content-type", mimetype);
        await context.res.setHeader("Content-Length", file.byteLength);
            
        // Set respose body
        context.res.end(file);
        
        /**
         * Block for sending file through HTTP Response ends
         */

        
    } 
    catch (error) 
    {
        return error;
    }
}





module.exports = {
    exportToExcel
};
