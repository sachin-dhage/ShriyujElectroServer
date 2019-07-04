//Import section
import mysql from 'mysql2';
import util from 'util';

// ---------- Development Servers --------------

// Remote host
let dbConfig = {

}; 

// Local host
/* const dbConfig = {

} */  


// ---------- Production Servers --------------
// Remote host



// Connection pool
let connectionPool = mysql.createPool(dbConfig);

// now get a Promise wrapped instance of that pool
let promisePool = connectionPool.promise();

// Export db connection pool
module.exports = promisePool;
