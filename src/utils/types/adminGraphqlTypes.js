import { GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

const PictureType = new GraphQLObjectType({
    name: "Picture",
    fields: {
        secure_url: { type: GraphQLString },
        public_id: { type: GraphQLString }
    }
});


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        _id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        gender: { type: GraphQLString },
        DOB: { type: GraphQLString },
        phone: { type: GraphQLString },
        role: { type: GraphQLString },
        profilePic: { type: PictureType },
        coverPic: { type: PictureType },
        isBanned: { type: GraphQLBoolean }
    }
});

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: {
        _id: { type: GraphQLID },
        companyName: { type: GraphQLString },
        companyEmail: { type: GraphQLString },
        industry: { type: GraphQLString },
        isBanned: { type: GraphQLBoolean },
        approvedByAdmin: { type: GraphQLBoolean },
        logo: { type: PictureType },
        coverPic: { type: PictureType }
    }
});


export const AdminResponseType = new GraphQLObjectType({
    name: 'AdminResponse',
    fields: {
        statusCode: { type: GraphQLInt },
        message: { type: GraphQLString },
        users: { type: new GraphQLList(UserType) },
        companies: { type: new GraphQLList(CompanyType) }
    }
});