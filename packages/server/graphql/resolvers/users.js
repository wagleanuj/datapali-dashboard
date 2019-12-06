const { FormFile } = require("../../models/form");
const { User } = require("../../models/user");

const { AuthenticationError, ApolloError } = require("apollo-server-express");

const resolvers = {
    Query: {
        users: async (parent, { ids }, context, info) => {
            if (!context._id && context.accountType!=="admin") throw new AuthenticationError();
            if(ids){
                const users = await User.find().where('_id').in(ids).populate("availableForms").populate("createdForms").populate("filledForms").exec();
                return users;
            }else{
                const allUsers = await User.find().populate("createdForms").populate("filledForms").populate("availableForms").exec();
                return allUsers;
            }
        }
            
    },
    Mutation: {
       
    }
}


module.exports = {
    UserResolvers: resolvers
};