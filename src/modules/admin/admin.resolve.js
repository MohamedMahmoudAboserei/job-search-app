// Import files
import * as dbService from '../../db/db.service.js';
import { AdminResponseType } from '../../utils/types/adminGraphqlTypes.js';
import userModel from '../../db/model/User.model.js';
import companyModel from '../../db/model/company.model.js';

// Admin GraphQL Resolver
export const adminResolve = {
    type: AdminResponseType,
    resolve: async (parent, args) => {
        // Fetch all users from database
        const users = await dbService.findAll({ model: userModel });
        // Fetch all companies from database
        const companies = await dbService.findAll({ model: companyModel });
        
        // Return standardized GraphQL response
        return {
            statusCode: 200,
            message: "Data retrieved successfully",
            users,
            companies
        };
    }
}