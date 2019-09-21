require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const mongoose = require("mongoose");
const { graphQlSchema } = require("./graphql/schema/index");
const app = express();
const path = require("path");
const {
  ApolloServer,
  ApolloError,
  AuthenticationError
} = require("apollo-server-express");
const {
  AuthorizationErrorsCodes,
  MailerErrorCodes
} = require("./error_defs/index");
const { createServer } = require("http");
const jwt = require("jsonwebtoken");
const { User } = require("./models/user");
const { Controls } = require("./models/controls");
const { Level } = require("./models/Level");

const { storyLevels } = require("./storyLevels/index");
const SALT_WORK_FACTOR = 10;
const bcrypt = require("bcrypt-nodejs");

app.use(express.static(path.join(__dirname, "../client/build")));
app.use("/assets", express.static(path.join(__dirname, "../client/assets")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.get("/reset-password", function(req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
//TODO:: instrospection and playground should be off in production when project is complete
const server = new ApolloServer({
  schema: graphQlSchema,
  introspection: true,
  playground: true,
  uploads: {
    maxFieldSize: 100,
    //Max allowed file size in bytes (default: Infinity).
    maxFileSize: 100
    //Max allowed number of files (default: Infinity).
  },
  context: ({ req }) => {
    let token = req.headers.authorization;
    if (!token) return null;
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
          reject(new AuthenticationError("Invalid user"));
        }
        if (decoded && decoded.email) {
          User.findOne({ email: decoded.email })
            .exec()
            .then(user => {
              if (!user) reject(new AuthenticationError("Invalid user"));
              resolve(user);
            });
        }
      });
    });
    return user;
  }
});
server.applyMiddleware({ app, bodyParserConfig: { limit: "100mb" } });
const httpServer = createServer(app); //http server is made to handle the websocket interface  to the subscriptions
server.installSubscriptionHandlers(httpServer);
const auth = process.env.DB_PASS
  ? { user: process.env.DB_USER, password: process.env.DB_PASS }
  : null;
//connect to the database
mongoose
  .connect(`${process.env.DB_HOST}/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    auth: auth
  })
  .then(dbClient => {
    initAdmin();
    //start listening at the server port
    httpServer.listen(process.env.SERVER_PORT, () => {
      console.log(`Listening at port ${process.env.SERVER_PORT}`);
      console.log(`Subscriptions  at path ${server.subscriptionsPath}`);
    });
  })
  .catch(err => {
    throw err;
  });

//function to initialize admin account and story levels
function initAdmin() {
  let username = process.env.STORY_LEVEL_CREATOR;
  let password = process.env.STORY_LEVEL_CREATOR_PASSWORD;
  let email = process.env.STORY_LEVEL_CREATOR_EMAIL;
  return User.findOne({ username: username })
    .exec()
    .then(user => {
      if (!user) {
        return new Promise((resolve, reject) => {
          bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
            if (err)
              reject(
                new ApolloError(
                  "Failed to generate salt",
                  AuthorizationErrorsCodes.BCRYPT_ERROR,
                  {}
                )
              );
            bcrypt.hash(password, salt, null, async (err, hash) => {
              if (err)
                reject(
                  new ApolloError(
                    "Failed to hash password",
                    AuthorizationErrorsCodes.BCRYPT_ERROR,
                    {}
                  )
                );
              password = hash;
              const newUser = new User({
                email: email,
                username: username,
                password: password
              });
              const newControls = new Controls({ user: newUser._id });
              //store the story levels
              let levelIds = [];
              for (let i = 0; i < storyLevels.length; i++) {
                let level = new Level({
                  name: "level" + (i + 1),
                  creator: newUser._id,
                  data: storyLevels[i].data
                });
                await level.save();
                levelIds.push(level._id);
              }
              newUser.savedLevels = levelIds;
              let result = await newUser.save();
              let userControls = await newControls.save();
              newUser.controls = newControls;
              await newUser.save();
              resolve({
                ...result._doc,
                controls: userControls,
                _doc: result.id
              });
            });
          });
        });
      } else {
        return user._doc;
      }
    });
}
