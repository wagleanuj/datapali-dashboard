const resolvers = require("../resolvers/index");
const { makeExecutableSchema } = require("graphql-tools");

const typeDefs =
    `type GeneralQueryResponse {
        message: String!
    }


    enum AccountType {
        surveyor
        admin
    }

    input UserRegisterInput{
        email: String!
        firstName: String!
        lastName: String!
        password: String!
        accountType: AccountType! 
        createdBy: String 
    }

    type FilledForm {
        id: ID!
        startedDate: String!
        completedDate: String!
        formId: String!
        filledBy: String!
        answerStore: String!
    }

    input FilledFormInput{
        id: ID!
        startedDate: String!
        completedDate:String
        formId: String!
        answerStore: String!
    }

    type User {
        _id: ID!
        email: String!
        firstName: String!
        lastName: String!
        accountType: AccountType!
        surveyorCode: String
        availableForms: [FormFile]
        filledForms: [FilledForm]
        createdForms: [FormFile]
    }

    type AuthData {
        user: User
        token: String!
    }

    type FormFile { 
        id: ID!
        name: String
        content: String
    }
    
    input FormFileInput {
        id: ID!
        name: String
        content: String
    }

    type Query {
        getFilledForms(bySurveyor: String): [FilledForm]
        forms(id: [String]): [FormFile]
        login(email: String!, password: String!): AuthData
        sendPasswordResetEmail(email: String!): GeneralQueryResponse!
    }

    type Mutation {
        makeFormAvailableFor(formId: String!, surveyorEmail: String!): GeneralQueryResponse!
        makeFormUnavailableFor(formId: String!, surveyorEmail: String!): GeneralQueryResponse!
        saveFilledForm(filledForm: FilledFormInput!): FilledForm
        deleteFilledForms(id: [String]!): GeneralQueryResponse!
        deleteForm(id: [String]!): GeneralQueryResponse!
        deleteAllFilledForms: GeneralQueryResponse!
        register(user: UserRegisterInput!): User
        saveForm(form: FormFileInput!): FormFile
        registerUser(username: String!, email: String!, password: String!): User!
        resetUserPassword(email: String!, password: String!, token: String!): User!
    }`;

module.exports = {
    graphQlSchema: makeExecutableSchema({ typeDefs, resolvers })
} 