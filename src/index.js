import { ApolloServer } from "apollo-server";
import { resolvers } from "./resolvers";
import typeDefs from "./schema.graphql";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server on ${url}`);
});
