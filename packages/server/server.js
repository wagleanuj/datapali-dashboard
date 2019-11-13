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
const { FormFile } = require("./models/form");

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
  ? { user: process.env.DB_USER, pass: process.env.DB_PASS }
  : null;
//connect to the database
mongoose
  .connect(process.env.DB_HOST, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(dbClient => {
    //start listening at the server port
    httpServer.listen(process.env.SERVER_PORT, () => {
      console.log(`Listening at port ${process.env.SERVER_PORT}`);
      console.log(`Subscriptions  at path ${server.subscriptionsPath}`);
    });
  })
  .catch(err => {
    throw err;
  });
