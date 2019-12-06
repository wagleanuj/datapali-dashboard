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
        _id: String!
        id: ID!
        startedDate: String!
        completedDate: String!
        formId: String!
        filledBy: User!
        answerStore: String!
        lastModified: User
        
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
        createdAt: String
        updatedAt: String
        assignedTo: [User]
    }
    
    input FormFileInput {
        id: ID!
        name: String
        content: String
    }
    input PaginationInput{
        offset: Int!
        limit: Int!
    }
    type FilledFormsQueryResult{
        totalCount: Int
        forms: [FilledForm]
    }


    type Query {
        getFilledForms(bySurveyorEmail: String, pagination: PaginationInput): FilledFormsQueryResult
        getFilledFormById(ids: [String]!): [FilledForm]
        forms(id: [String]): [FormFile]
        users(ids:[String]): [User]
        login(email: String!, password: String!): AuthData
        sendPasswordResetEmail(email: String!): GeneralQueryResponse!
        runQueryOn(formId:String!, query: String!): String!
        runAggregationOn(formId:String!, query:String!):String!

    }

    type Mutation {
        makeFormsAvailableFor(formIds: [String]!, surveyorEmails: [String]!): GeneralQueryResponse!
        makeFormsUnavailableFor(formIds: [String]!, surveyorEmails: [String]!): GeneralQueryResponse!
        saveFilledForm(filledForm: FilledFormInput!): FilledForm
        deleteFilledForms(id: [String]!): GeneralQueryResponse!
        deleteForm(id: [String]!): GeneralQueryResponse!
        deleteAllFilledForms: GeneralQueryResponse!
        register(user: UserRegisterInput!): User
        saveForm(form: FormFileInput!): FormFile
        registerUser(username: String!, email: String!, password: String!): User!
        resetUserPassword(email: String!, password: String!, token: String!): User!
        initDbFor(formId:String!):GeneralQueryResponse
    }`;

module.exports = {
    graphQlSchema: makeExecutableSchema({ typeDefs, resolvers })
} 