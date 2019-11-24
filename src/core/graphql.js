import { ApolloServer } from 'apollo-server-express';
import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { PubSub } from 'graphql-subscriptions';

import { recipeTypeDefs, recipeResolvers } from '~/recipes/graphql';
import authorization from '~/authorization/graphql';
import query from './mut_query';

const typeDefs = mergeTypes([query, recipeTypeDefs, authorization.typeDefs], {
  all: true,
});

const resolvers = mergeResolvers([recipeResolvers, authorization.resolvers]);

const context = ({ req }) => ({
  user: req.user,
});

export const pubsub = new PubSub();

export default new ApolloServer({
  typeDefs,
  resolvers,
  context,
});
