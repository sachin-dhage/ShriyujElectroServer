import { merge } from "lodash";

//Importing resolvers
import authResolvers from './authResolvers';
import ddlResolvers from "./ddlResolvers";
import excelReportResolvers from "./excelReportResolvers";
import emailResolvers from './emailResolvers';

import gpioPinStatusResolvers from './gpioPinStatusResolvers';

// Merge all of the resolver objects together
const resolvers = merge(
    authResolvers,
    ddlResolvers,
    excelReportResolvers,
    emailResolvers,

    gpioPinStatusResolvers
);

// Export merged resolvers
module.exports = resolvers;