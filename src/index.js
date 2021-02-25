const express = require("express");
const { ApolloServer } = require("apollo-server-express");
require("dotenv").config();
const db = require("./db");
const models = require("./models");
const resolvers = require("./resolvers");
const app = express();

//GraphQl Scheme
const typeDefs = require("./schema");

//dynamic port
const port = process.env.PORT || 3000;

const DB_HOST = process.env.DB_HOST;

db.connect(DB_HOST);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return { models };
  },
});

server.applyMiddleware({ app, path: "/api" });

app.get("/", (req, res) => res.send("Hello World!!!"));

app.listen(port, () =>
  console.log(
    `Server has begun on port http:localhost:${port}${server.graphqlPath}`
  )
);
