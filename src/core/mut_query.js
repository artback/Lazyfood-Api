import gql from 'graphql-tag';

const typeDefs = gql`
  type Query {
    profile: User
    ratings(recipeIds: [String]): [Rating]!
    menu(yearWeek: String!): [MenuItem]
    rating(recipeId: String!): Rating
    recipes(query: String): [Recipe]
    recipesWithRatings(query: String): [RatingAndRecipe]
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): String
    login(email: String!, password: String!): String
    deleteRating(recipeId: String!): Rating
    updateMenu(menu: [String!]!, yearWeek: String!): [String!]!
    updateRating( recipeId: String!,rating: Int! ): Rating
  }
`;

export default typeDefs;
