import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { adminResolve } from "./admin/admin.resolve.js";

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Admin',
        description: 'This is for admin',
        fields: {
            getAllData: adminResolve
        }
    })
})
