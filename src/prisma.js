import { Prisma } from "prisma-binding";

export const prisma = new Prisma({
  typeDefs: "src/generated/schema.graphql",
  endpoint: "http://localhost:4466",
});
