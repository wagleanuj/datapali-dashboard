const resolvers = require("../resolvers/index");
const { makeExecutableSchema } = require("graphql-tools");

const typeDefs = `
type GeneralQueryResponse {
    message: String!
}

type User {
    _id: ID!
    email: String!
    controls: Controls
}

type AuthData {
    user: User
    username: ID!
    token: String!
    tokenExpiration: Int!
}

input Vec2Input{
    x: Int!
    y: Int!
}

type Vec2{
    x: Int!
    y: Int!
}

type Level {
    _id: ID!
    name: String!
    creator: String!
    creationDate: Int!
    data: [LevelData]!
}

type LevelData {
    animation: String!
    pos: Vec2!
    type: [String]
}

input LevelDataInput{
    animation: String!
    pos: Vec2Input!
    type: [String]
}

enum Difficulty {
    easy
    medium
    hard
}

type LevelProgress {
    _id:ID
    levelId: String!
    stars: Int
    timeSpent: Float!
    bestTime: Float
    coinsCollected: Int
    success: Boolean
    completionDate: Float
}

input LevelProgressInput {
    _id:ID
    gameFile: String
    user: String
    levelId: String!
    timeSpent: Float!
    bestTime: Float
    coinsCollected: Int
    stars: Int
    success: Boolean
    completionDate: Float
}
type GameFileDeletionResult{
    success: Boolean
    gameFiles:[GameFile]
}

type GameFile {
    _id: ID!
    user: User!
    difficulty: Difficulty!
    progress: [LevelProgress]!
    hasCompleted: Boolean!
}

input GameFileInput {
    _id: ID
    difficulty: Difficulty!
    progress: [LevelProgressInput]!
    hasCompleted: Boolean
}

type Controls {
    UP: String!
    DOWN: String!
    LEFT: String!
    RIGHT: String!
    JUMP: String!
    SLIDE: String!
    ACTION: String!
    LEFT_SWAP: String!
    RIGHT_SWAP: String!
}

input ControlsInput{
    UP: String!
    DOWN: String!
    LEFT: String!
    RIGHT: String!
    JUMP: String!
    SLIDE: String!
    ACTION: String!
    LEFT_SWAP: String!
    RIGHT_SWAP: String!
}

type LeaderBoardData{
    user: String!
    completionTime: Float!
    completionDate: Float
    difficulty: Difficulty
}

type Query {
    login(usernameOrEmail: String!, password: String!): AuthData
    sendPasswordResetEmail(email: String!): GeneralQueryResponse!
    getLevel(levelId: String): [Level]!
    getStoryLevel(index: Int, gameFileId: String!): [Level]!
    getGameFile(gameFileId: String): [GameFile]!
    getControls: Controls!
    leaderBoard: [LeaderBoardData]!
}

type Mutation {
    registerUser(username: String!, email: String!, password: String!): User!
    resetUserPassword(email: String!, password: String!, token: String!): User!
    saveLevel(levelData: [LevelDataInput]!, levelName: String, levelId: String): Level!
    deleteLevel(levelId: String!): GeneralQueryResponse!
    deleteAll(levelId: String): GeneralQueryResponse!
    saveStoryLevel(levelData: [LevelDataInput]!, levelName: String, levelId: String): Level!
    saveGameFile(gameFile: GameFileInput!): GameFile!
    deleteGameFile(gameFileId: String!):GameFileDeletionResult!
    saveControls(controls: ControlsInput!): Controls!
}`;

module.exports = {
    graphQlSchema: makeExecutableSchema({ typeDefs, resolvers })
} 