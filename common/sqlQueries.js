/**
 * Raspberry Pi GUI with GPIO
 */

/**--------- Login Section --------- **/

// Query for Searching Users
export const searchUsersQuery = `
SELECT * 
FROM USERS
WHERE 
    UPPER(TRIM(EMAIL))	= UPPER(TRIM(?))
`;


// Query for Searching Blacklisted Tokens
export const searchBlacklistQuery = `
SELECT * 
FROM BLACKLIST
WHERE 
    UPPER(TRIM(TOKEN))	= UPPER(TRIM(?))
`;


/**--------- Company Master --------- **/

/* --- Old Query ---
// Query for Searching Companies
export const searchCompaniesQuery = `
    SELECT * 
    FROM COMPANYMASTER
    WHERE 
        COALESCE(UPPER(TRIM(COMPANYID)),'%')		LIKE UPPER(TRIM(?))	AND
        COALESCE(UPPER(TRIM(COMPANYNAME)),'%')	LIKE UPPER(TRIM(?))	AND
        COALESCE(UPPER(TRIM(PANNO)),'%')		LIKE UPPER(TRIM(?))	AND
        COALESCE(UPPER(TRIM(GSTTINNO)),'%')	    LIKE UPPER(TRIM(?))	AND
        COALESCE(UPPER(TRIM(ADDRESS)),'%')	    LIKE UPPER(TRIM(?))	AND 
        ISDELETE = 0
    ORDER BY COMPANYNAME ASC, PANNO ASC
`;*/


// Query for Searching Companies
export const searchCompaniesQuery = `
    SELECT CM.*, CY.CITY, COUNT(CT.COMPANYID) USAGECOUNT 
    FROM COMPANYMASTER CM
    LEFT JOIN VW_CATDETAILS CT
    ON (    
            CM.COMPANYID = CT.COMPANYID 
        )
    JOIN CITYMASTER CY 
    ON ( 
            CM.CITYID = CY.CITYID	AND
            CM.ISDELETE = CY.ISDELETED
        )
    WHERE   
        COALESCE(UPPER(TRIM(CM.COMPANYID)),'%')		LIKE UPPER(TRIM(?))	AND
        COALESCE(UPPER(TRIM(CM.COMPANYNAME)),'%')	LIKE UPPER(TRIM(?))	AND
        COALESCE(UPPER(TRIM(CM.PANNO)),'%')		LIKE UPPER(TRIM(?))	AND
        COALESCE(UPPER(TRIM(CM.GSTTINNO)),'%')	    LIKE UPPER(TRIM(?))	AND
        COALESCE(UPPER(TRIM(CM.ADDRESS)),'%')	    LIKE UPPER(TRIM(?))	AND 
        CM.ISDELETE = 0
    GROUP BY CM.COMPANYID, CM.COMPANYNAME
    ORDER BY CM.COMPANYNAME ASC, CM.PANNO ASC
`;

// Query for checking duplicate Companies
export const checkDuplicateCompaniesQuery = `
    SELECT COUNT(*) COUNT 
    FROM COMPANYMASTER 
    WHERE 
        UPPER(TRIM(PANNO))       LIKE    UPPER(TRIM(?))  AND
        ISDELETE = 0
`;


// Query for checking duplicate PAN
export const checkDuplicateCompanyPANQuery = `
    SELECT COUNT(*) COUNT 
    FROM COMPANYMASTER 
    WHERE 
        UPPER(TRIM(PANNO))       LIKE        UPPER(TRIM(?))  AND
        UPPER(TRIM(COMPANYID))   NOT LIKE    UPPER(TRIM(?))  AND
        ISDELETE = 0
`;

// Query for Exporting Companies List to Excel
export const exportCompaniesQuery = `
    SELECT
        'Name of Company',
        'PAN Number',
        'GSTIN Number',
        'Landline Number',
        'Mobile Number',
        'Email Address',
        'City',
        'Address'

    UNION

    SELECT * FROM 
    (
        SELECT  COMPANYNAME,
                PANNO,
                GSTTINNO,
                LLNO,
                MBNO,
                EMAIL,
                CITYID,
                ADDRESS
        FROM COMPANYMASTER
        WHERE 
            COALESCE(UPPER(TRIM(COMPANYID)),'%')		LIKE UPPER(TRIM(?))	AND
            COALESCE(UPPER(TRIM(COMPANYNAME)),'%')	LIKE UPPER(TRIM(?))	AND
            COALESCE(UPPER(TRIM(PANNO)),'%')		LIKE UPPER(TRIM(?))	AND
            COALESCE(UPPER(TRIM(GSTTINNO)),'%')	    LIKE UPPER(TRIM(?))	AND
            COALESCE(UPPER(TRIM(ADDRESS)),'%')	    LIKE UPPER(TRIM(?))	AND
            ISDELETE = 0
        ORDER BY COMPANYNAME ASC, PANNO ASC
    ) TAB
`;


// Query for ddl Companies
export const companiesDDLQuery = `
    SELECT DISTINCT COMPANYID  AS "CODE", COMPANYNAME AS "DESC" 
    FROM COMPANYMASTER 
    WHERE ISDELETE = 0
    ORDER BY UPPER(TRIM(COMPANYNAME)) ASC
`;