import { mergeTypes } from "merge-graphql-schemas";

// Importing types

import authTypes from './authTypes';
import enumTypes from './enumTypes';
import ddlTypes from './ddlTypes';
import excelReportTypes from './excelReportTypes';
import emailTypes from './emailTypes';

import gpioPinStatusTypes from './gpioPinStatusTypes';

// Merge all of the types together
const types = [
    authTypes,
    enumTypes,
    ddlTypes,
    excelReportTypes,
    emailTypes,

    gpioPinStatusTypes
];
  
// NOTE: 2nd param is optional, and defaults to false
// Only use if you have defined the same type multiple times in
// different files and wish to attempt merging them together.
const typeDefs =  mergeTypes(types, { all: true });


module.exports = typeDefs;
