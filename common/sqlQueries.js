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


