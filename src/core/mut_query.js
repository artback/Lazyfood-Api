import gql from 'graphql-tag';

const typeDefs = gql`
  type Query {
    profile: User
    ratings(recipeIds: [String]): [Rating]!
    menu(yearWeek: String!): [MenuItem]
    rating(recipeId: String!): Rating
    recipe(query: String, begin: Int, end: Int): [Recipe]
    recipesWithRating(query: String): [RatingAndRecipe]
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): String
    login(email: String!, password: String!): String
    deleteRating(recipe_id: String!): Rating
    updateMenu(menu: [String!]!, year_week: String!): [String!]!
    updateRating(rating: Int!, recipe_id: String!): Rating
  }
`;

export default typeDefs;
