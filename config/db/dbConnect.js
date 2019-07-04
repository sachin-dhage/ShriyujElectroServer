//Import section
import mysql from 'mysql2';
import util from 'util';

// ---------- Development Servers --------------

// Remote host
let dbConfig = {
    host : "207.174.215.236",
    //port : "3306",
    user : "algorzpv_itian",
    password : "itian",
    database : "algorzpv_itian",
    multipleStatements: true,
    waitForConnections: true,
    //connectionLimit: 10,
    queueLimit: 0
}; 

// Local host
/* const dbConfig = {
    host : "localhost",
    user : "root",
    //password : "it_qa",
    database : "lorryreceipt",
    multipleStatements: true
} */  


// ---------- Production Servers --------------
// Remote host



// Connection pool
let connectionPool = mysql.createPool(dbConfig);

// now get a Promise wrapped instance of that pool
let promisePool = connectionPool.promise();

// Export db connection pool
module.exports = promisePool;