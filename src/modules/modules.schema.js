// Import files
import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { adminResolve } from "./admin/admin.resolve.js";

// Create GraphQL schema instance
export const schema = new GraphQLSchema({
    // Define root query type
    query: new GraphQLObjectType({
        name: 'Admin', // Type name for documentation
        description: 'This is for admin', // Schema documentation
        fields: {
            // Define accessible admin query
            getAllData: adminResolve // Connects resolver to query field
        }
    })
})
