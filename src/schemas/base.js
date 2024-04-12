import { gql } from "apollo-server";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import DeliverOptionMutation from "./DeliverOption/mutation.js";
import DeliverOptionQuery from "./DeliverOption/query.js";

const typeDefs = mergeTypeDefs([
]);

const resolvers = mergeResolvers([
]);

export default makeExecutableSchema({ typeDefs, resolvers });
