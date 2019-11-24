import gql from 'graphql-tag';

import { User } from './document';

const typeDefs = gql`
  type User {
    id: Int!
    username: String!
    email: String!
  }
`;

const resolvers = {
  Query: {
    async profile(_, args, { user }) {
      if (!user) {
        throw new Error('You are not authenticated!');
      }

      const data = await User.findById(user.id);

      return data;
    },
  },
  Mutation: {
  },
};

export default { typeDefs, resolvers };
