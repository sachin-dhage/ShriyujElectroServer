// Import the connection pool
import dbConnectionPool from '../config/db/dbConnect';
import util from 'util';

// Get the table data based on the select query and placeholders
const getTableData = async (selectQuery, placeHolders) =>
{

    try 
    {
        // if select Query is not available, throw error
        if(typeof selectQuery === 'undefined' || selectQuery.trim().length == 0 ) 
            throw new Error("select query is required and can not be empty.");

        let result;

        // Use query method to get data from mysql table 
        result = await dbConnectionPool.query(selectQuery, placeHolders)
        //console.log("Result: " + JSON.stringify(result));

        return result[0];
        //return result;
    } 
    catch (error) 
    {
        console.log("Error => ");
        console.log(error);
        
        throw error;
    } 

}


// Create database table
const createTable = async (tableDDL) => 
{
    try 
    {
        // if table DDL is not available, throw error
        if(typeof tableDDL === 'undefined' || tableDDL.trim().length == 0 ) 
            throw new Error("table DDL is required and can not be empty.");
    
        let result;

        // Use query method to create mysql table 
        result = await dbConnectionPool.query(tableDDL);

        console.log("table created..");
        
        return result[0];
    } 
    catch (error) 
    {
        console.log("Error : ");
        console.log(error);
        
        throw error;
    }
}

// Insert the records in table 
const insertTableRecords = async (insertDML, valuesArray) =>
{
    let connection;

    try 
    {
        // if insert DML is not available, throw error
        if(typeof insertDML === 'undefined' || insertDML.trim().length == 0 ) 
            throw new Error("insert DML is required and can not be empty.");

        // if values Array is not available, throw error
        if(typeof valuesArray === 'undefined' || valuesArray.length == 0 ) 
            throw new Error("values are required and can not be empty.");

        let result;
        let recordsInserted = 0;

        // Get database connection from connection pool
        connection = await dbConnectionPool.getConnection();
        //console.log("Connection Object: " + JSON.stringify(connection));

        // Begin Transaction
        await connection.beginTransaction();

        // Use query method to insert records in mysql table            
        try 
        {
            for(let i=0; i<valuesArray.length; i++)
            {
                result = await connection.query(insertDML, valuesArray[i]);
                recordsInserted = recordsInserted + result[0].affectedRows;   
            }

        } catch (error) 
        {
            throw error;
        }

        //console.log("No of records inserted : ");       
        //console.log(recordsInserted);

        // Commit Transaction
        console.log("Committing transactions...");
        await connection.commit();

        return recordsInserted;
    } 
    catch (error) 
    {
        // Rollback Transaction
        console.log("Rolling back transactions...");
        await connection.rollback();

        console.log("Error : ");
        console.log(error);
        
        throw error;
    }
    finally 
    {
        if (connection) 
        { // conn assignment worked, need to close
          try 
          {
            console.log("Closing Connection...");
            await connection.release();
          } 
          catch (err) 
          {
            throw err;
          }
        }   
    }
}


// UPDATE the records in table 
const updateTableRecords = async (updateDML, valuesArray) =>
{
    let connection;

    try 
    {
        // if update DML is not available, throw error
        if(typeof updateDML === 'undefined' || updateDML.trim().length == 0 ) 
            throw new Error("update DML is required and can not be empty.");

        // if values Array is not available, throw error
        if(typeof valuesArray === 'undefined' || valuesArray.length == 0 ) 
            throw new Error("values are required and can not be empty.");

        let result;
        let recordsUpdated = 0;

        // Get database connection from connection pool
        connection = await dbConnectionPool.getConnection();
        //console.log("Connection Object: " + JSON.stringify(connection));

        // Begin Transaction
        await connection.beginTransaction();
        
        // Use query method to update records in mysql table            
        try 
        {
            for(let i=0; i<valuesArray.length; i++)
            {
                result = await connection.query(updateDML, valuesArray[i]);
                recordsUpdated = recordsUpdated + result[0].affectedRows;   
            }

        } catch (error) 
        {
            throw error;
        }

        //console.log("No of records updated : ");       
        //console.log(recordsUpdated);

        // Commit Transaction
        console.log("Committing transactions...");
        await connection.commit();

        return recordsUpdated;
    } 
    catch (error) 
    {
        // Rollback Transaction
        console.log("Rolling back transactions...");
        await connection.rollback();

        console.log("Error : ");
        console.log(error);
        
        throw error;
    }
    finally 
    {
        if (connection) 
        { // conn assignment worked, need to close
          try 
          {
            console.log("Closing Connection...");
            await connection.release();
          } 
          catch (err) 
          {
            throw err;
          }
        }   
    }
}


// Execute DML Transactions
const executeDMLTransactions = async (DMLStatements) =>
{
    let connection;

    try 
    {
        DMLStatements = DMLStatements || [];
        //DMLStatements.push(`INSERT INTO USERS VALUES('1','2')`);

        let dmlStatement;
        let result;
        let affectedRecords = 0;

        // Get database connection from connection pool
        connection = await dbConnectionPool.getConnection();
        //console.log("Connection Object: " + JSON.stringify(connection));

        // Begin Transaction
        await connection.beginTransaction();
        //await connection.query('START TRANSACTION');

        // Use database service to execute DML statements
        for(let j = 0; j < DMLStatements.length; j++)
        {
            dmlStatement = DMLStatements[j];

            // if DML statment is not available, throw error
            if(typeof dmlStatement === 'undefined' || dmlStatement.trim().length == 0 ) 
                throw new Error("DML Statement is required and can not be empty.");

            // Use query method to execute query         
            result = await connection.query(dmlStatement);
            //console.log("Result: " + JSON.stringify(result[0]));

            affectedRecords = affectedRecords + result[0].affectedRows;
        }

        // Commit Transaction
        console.log("Committing transactions...");
        //await connection.query('COMMIT');
        await connection.commit();

        return affectedRecords;

    } 
    catch (error) 
    {
        // Rollback Transaction
        console.log("Rolling back transactions...");
        //await connection.query('ROLLBACK');
        await connection.rollback();
        
        console.log("Error : ");
        console.log(error);
        
        throw error;        
    }
    finally 
    {
        if (connection) 
        { // conn assignment worked, need to close
          try 
          {
            console.log("Closing Connection...");
            await connection.release();
          } 
          catch (err) 
          {
            throw err;
          }
        }   
    }
}



// Form the Insert statement 
const getInsertStatement = async (tableName, dataJSON) =>
{
    try 
    {
        // if table name is not available, throw error
        if(typeof tableName === 'undefined' || tableName.trim().length == 0 ) 
            throw new Error("table name is required and can not be empty.");


        // if values are not available, throw error
        if(typeof dataJSON === 'undefined' || Object.keys(dataJSON).length == 0 ) 
            throw new Error("data json is required and can not be empty.");


        let insertStatement = "INSERT INTO " + tableName + "(";

        // Get the data json destructured for column names
        for(let key in dataJSON) 
        { 
            insertStatement = insertStatement + key + ", ";
            //console.log("Key: " + key + " value: " + dataJSON[key]);
        }

        // remove the extra ',' from statement
        insertStatement = insertStatement.substring(0, insertStatement.lastIndexOf(","));

        insertStatement = insertStatement + ") VALUES (";

        // Get the data json destructured for coulmn values
        for(let key in dataJSON) 
        { 
            insertStatement = insertStatement + "'" + dataJSON[key] + "', ";
            //console.log("Key: " + key + " value: " + dataJSON[key]);
        }

        // remove the extra ',' from statement
        insertStatement = insertStatement.substring(0, insertStatement.lastIndexOf(","));
        
        insertStatement = insertStatement + ")";

        return await insertStatement;

    } 
    catch (error) 
    {
        console.log("Error : ");
        console.log(error);
        
        throw error;        
    }
}


// Form the Update statement 
const getUpdateStatement = async (tableName, dataJSON, caluseJSON) =>
{
    try 
    {
        // if table name is not available, throw error
        if(typeof tableName === 'undefined' || tableName.trim().length == 0 ) 
            throw new Error("table name is required and can not be empty.");


        // if values are not available, throw error
        if(typeof dataJSON === 'undefined' || Object.keys(dataJSON).length == 0 ) 
            throw new Error("data json is required and can not be empty.");


        let updateStatement = "UPDATE " + tableName;
        updateStatement = updateStatement + " SET ";

        // Get the data json destructured
        for(let key in dataJSON) 
        { 
            updateStatement = updateStatement + " " + key + " = '" + dataJSON[key] + "', ";
            //console.log("Key: " + key + " value: " + dataJSON[key]);
        }

        // remove the extra ',' from statement
        updateStatement = updateStatement.substring(0, updateStatement.lastIndexOf(","));

        // if clauses are available
        if(typeof caluseJSON !== 'undefined' && Object.keys(caluseJSON).length != 0 ) 
        {
            updateStatement = updateStatement + " WHERE ";
            
            // Get the clause json destructured
            for(let key in caluseJSON) 
            { 
                updateStatement = updateStatement + " " + key + " = '" + caluseJSON[key] + "' AND ";
                //console.log("Key: " + key + " value: " + caluseJSON[key]);
            }
            
            // remove the extra 'AND' from statement
            updateStatement = updateStatement.substring(0, updateStatement.lastIndexOf("AND"));

        }        

        return await updateStatement;

    } 
    catch (error) 
    {
        console.log("Error : ");
        console.log(error);
        
        throw error;        
    }
}



// Form the delete statement for PHYSICAL delete 
const getDeleteStatement = async (tableName, caluseJSON) =>
{
    try 
    {
        // if table name is not available, throw error
        if(typeof tableName === 'undefined' || tableName.trim().length == 0 ) 
            throw new Error("table name is required and can not be empty.");

        let deleteStatement = "DELETE FROM " + tableName;

        // if clauses are available
        if(typeof caluseJSON !== 'undefined' && Object.keys(caluseJSON).length != 0 ) 
        {
            deleteStatement = deleteStatement + " WHERE ";
            
            // Get the clause json destructured
            for(let key in caluseJSON) 
            { 
                deleteStatement = deleteStatement + " " + key + " = '" + caluseJSON[key] + "' AND ";
                //console.log("Key: " + key + " value: " + caluseJSON[key]);
            }
            
            // remove the extra 'AND' from statement
            deleteStatement = deleteStatement.substring(0, deleteStatement.lastIndexOf("AND"));

        }        

        return await deleteStatement;

    } 
    catch (error) 
    {
        console.log("Error : ");
        console.log(error);
        
        throw error;        
    }
}


// Execute Stored Procedure / Function
/**
 * Test 1 - Without any parameter
 *  DELIMITER $$
        CREATE PROCEDURE GET_ALL_EMPLOYEES()
        BEGIN
            SELECT LEDGERID AS ID, LEDGERNAME AS NAME, ADDRESS AS LOCATION 
            FROM LEDGERMASTER;
        END$$
    DELIMITER ; 
 * 
 * Test 1 Call - 'CALL GET_ALL_EMPLOYEES()'
 * --------------------------------------------------------------------------------
 * Test 2 - With input parameters
 *  DELIMITER $$
        CREATE PROCEDURE GET_EMPLOYEE_INFO(IN EMPID INT(24), IN ISDELETE INT(11))
        BEGIN
            SELECT LEDGERID AS ID, LEDGERNAME AS NAME, ADDRESS AS LOCATION 
            FROM LEDGERMASTER;
        END$$
    DELIMITER ; 
 * 
 * Test 2 Call - 'CALL GET_EMPLOYEE_INFO(?, ?)'
 * Test 2 Parameters - [11, 0]
 * --------------------------------------------------------------------------------
 * Test 3 - With input & Output parameters
 *  DELIMITER $$
        CREATE PROCEDURE TESTPROC(IN PIN VARCHAR(24), INOUT PINOUT VARCHAR(24), OUT POUT INT(10))
        BEGIN
            SET PINOUT = CONCAT(PIN, PINOUT);
            SET POUT = 2019;
        END$$
    DELIMITER ; 
 * 
 * Test 3 Call - 'CALL TESTPROC(?, ?, ?)'
 * Test 3 Parameters - ['Discriminant', 'Technologies', 0]
 * 
 * */
const executeStoredProcedure = async (procedureCall, valuesArray) =>
{
    // Test 1 - Procedure Call
    procedureCall = 'CALL GET_ALL_EMPLOYEES()';

    // Test 2 - Procedure Call
    //procedureCall = 'CALL GET_EMPLOYEE_INFO(?, ?)';
    //valuesArray = [11, 0];

    // Test 3 - Procedure Call
    /*procedureCall = `
        SET @PINOUT = 'Technologies';
        CALL TESTPROC(?, @PINOUT, @POUT); 
        SELECT @POUT AS POUT, @PINOUT AS PINOUT;
    `;

    valuesArray = ['Discriminant'];*/

    try 
    {
        // if procedure name is not available, throw error
        if(typeof procedureCall === 'undefined' || procedureCall.trim().length == 0 ) 
            throw new Error("procedure call is required and can not be empty.");

        // if values Array is not available, throw error
        //if(typeof valuesArray === 'undefined' || valuesArray.length == 0 ) 
        //    throw new Error("values are required and can not be empty.");

        let result;
        let recordsInserted = 0;
        
        // Use query method to execute procedure/function in mysql            
        try 
        {
            result = await dbConnectionPool.query(procedureCall, valuesArray);

        } catch (error) 
        {
            throw error;
        }

        console.log("Procedure Result: " + JSON.stringify(result[0][0])); // for Procedure 1 & 2
        //console.log("Procedure Result: " + JSON.stringify(result[0][1]));  // for Procedure 3 

        return result[0][0];
    } 
    catch (error) 
    {
        console.log("Error : ");
        console.log(error);
        
        throw error;
        
    }
}



// Export functions
module.exports = {
    getTableData, 
    createTable,
    insertTableRecords,
    updateTableRecords,
    executeDMLTransactions,
    getInsertStatement,
    getUpdateStatement,
    getDeleteStatement,
    executeStoredProcedure
};