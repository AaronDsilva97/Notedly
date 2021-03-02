const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const depthLimit = require("graphql-depth-limit");
const { createComplexityLimitRule } = require("graphql-validation-complexity");
require("dotenv").config();
const db = require("./db");
const models = require("./models");
const resolvers = require("./resolvers");

const app = express();

app.use(cors());

app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  })
);
// get the user info from a JWT
const getUser = (token) => {
  if (token) {
    try {
      // return the user information from the token
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // if there's a problem with the token, throw an error
      throw new Error("Session invalid");
    }
  }
};

//GraphQl Scheme
const typeDefs = require("./schema");

//dynamic port
const port = process.env.PORT || 4000;

const DB_HOST = process.env.DB_HOST;

db.connect(DB_HOST);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
  context: async ({ req }) => {
    // get the user token from the headers
    const token = req.headers.authorization;
    // try to retrieve a user with the token
    const user = await getUser(token);
    // for now, let's log the user to the console:
    // console.log(user);
    // add the db models and the user to the context
    return { models, user };
  },
});

server.applyMiddleware({ app, path: "/api" });

app.get("/", (req, res) => res.send("Hello World!!!"));

app.listen(port, () =>
  console.log(
    `Server has begun on port http:localhost:${port}${server.graphqlPath}`
  )
);
