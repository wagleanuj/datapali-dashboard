const resolvers = require("../resolvers/index");
const { makeExecutableSchema } = require("graphql-tools");

const typeDefs = `
type GeneralQueryResponse {
    message: String!
}

type User {
    _id: ID!
    email: String!
}
enum QAType {
    string
    html
}
enum ANSWER_TYPES {
    boolean
    string
    date
    time
    number
    range
    select
}
enum QAComparisonOperator {
    E
    G
    GE
    L
    LE
}
enum QAFollowingOperator{
   OR
   AND
}

type AuthData {
    user: User
    username: ID!
    token: String!
    tokenExpiration: Int!
}

type IContent {
    content: String!
    type: QAType
}

type IValueType {
    name:ANSWER_TYPES!
    ofType: IValueType
}

type ILiteral{
    literalId: String!
    questionRef: String
    comparisonOperator: QAComparisonOperator
    comparisonValue: IContent
    followingOperator: QAFollowingOperator
}

type QACondition{
    literals: [ILiteral]
}

type IAnswerCondition {
    condition : QACondition,
    ifTrue: String,
    ifFalse: String
}
type IAutoAnswer {
    isEnabled: Boolean!
    answeringConditions: [IAnswerCondition]
}
type QAQuestion {
    id: String!,
    isRequired: Boolean!
    questionContent: IContent
    name: String
    creationDate: Int!
    answerType: IValueType
    options: AnswerOptions
    autoAnswer: IAutoAnswer
}
type RootSection { 
    id: ID!
    name: String
    content: String
}
type IOption {
    appearingCondition: QACondition
    type: IValueType
    id : String!
    value: String
    groupName : String
}

type IOptionGroup {
    id: String!
    name: String
    appearignCondition: QACondition
    members: [IOption]
}
type AnswerOptions {
    optionsMap : [IOption]
    optionsGroupMap: [IOptionGroup]
}
enum DuplicateTimesType{
    questionRef
    number
}


input DupeTimeInput {
    value : String
    type: DuplicateTimesType
}
type DupeTime {
    value : String
    type: DuplicateTimesType
}


type IDupeSettings { 
    isEnabled: Boolean!
    condition : QACondition
    duplicateTimes : DupeTime

}


union QS = QuestionSection| QAQuestion
type QuestionSection {
    id: ID!
    name: String
    content : [QS]
    duplicatingSettings: IDupeSettings

}
input RootSectionInput {
    id: ID!
    name: String
    content: String
}

type Query {
    forms(id: String!): [RootSection]
    login(usernameOrEmail: String!, password: String!): AuthData
    sendPasswordResetEmail(email: String!): GeneralQueryResponse!
}

type Mutation {
    saveForm(form: RootSectionInput!): RootSection
    registerUser(username: String!, email: String!, password: String!): User!
    resetUserPassword(email: String!, password: String!, token: String!): User!
}`;

module.exports = {
    graphQlSchema: makeExecutableSchema({ typeDefs, resolvers })
} 