const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
require("dotenv").config();
const db = require("./db");
const models = require("./models");

const app = express();

//dynamic port
const port = process.env.PORT || 3000;

const DB_HOST = process.env.DB_HOST;

//GraphQl Scheme
const typeDefs = gql`
  type Note {
    id: ID!
    content: String!
    author: String!
  }

  type Query {
    hello: String
    notes: [Note!]!
    note(id: ID!): Note!
  }

  type Mutation {
    newNote(content: String!): Note!
  }
`;

const resolvers = {
  Query: {
    notes: async () => {
      return await models.Note.find();
    },
    note: async (parent, args) => {
      return await models.Note.findById(args.id);
    },
  },

  Mutation: {
    newNote: async (parent, args) => {
      return await models.Note.create({
        content: args.content,
        author: "Aaron Dsilva",
      });
    },
  },
};

db.connect(DB_HOST);

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app, path: "/api" });

app.get("/", (req, res) => res.send("Hello World!!!"));

app.listen(port, () =>
  console.log(
    `Server has begun on port http:localhost:${port}${server.graphqlPath}`
  )
);
