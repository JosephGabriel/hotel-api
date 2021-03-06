import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { resolvers } from "./resolvers";
import { prisma } from "./prisma";
import fs from "fs";

const typeDefs = fs.readFileSync(`${__dirname}/schema.graphql`).toString();

const context = ({ req }) => {
  //req.headers.authorization;
  const headers = req.headers.authorization;
  return { prisma, headers };
};

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    debug: process.env.NODE_ENV === "production" ? true : false,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  });

  await server.start();

  const app = express();

  server.applyMiddleware({ app });

  await new Promise((r) => app.listen({ port: 4000 }, r));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startServer();
