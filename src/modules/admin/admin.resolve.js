import * as dbService from '../../db/db.service.js';
import { AdminResponseType } from '../../utils/types/adminGraphqlTypes.js';
import userModel from '../../db/model/User.model.js';
import companyModel from '../../db/model/company.model.js';

export const adminResolve = {
    type: AdminResponseType,
    resolve: async (parent, args) => {
        const users = await dbService.findAll({ model: userModel });
        const companies = await dbService.findAll({ model: companyModel });
        
        return {
            statusCode: 200,
            message: "Data retrieved successfully",
            users,
            companies
        };
    }
}