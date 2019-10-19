import gql from 'graphql-tag';

import axios from 'axios';
import { Recipe, Rating } from '../core/document';

export const recipeTypeDefs = gql`
  type RatingAndRecipe {
    recipe: Recipe
    rating: Rating
  }
  type MenuItem {
    recipe: Recipe
    rating: RatingWithDay
  }
  type RatingWithDay {
    updated: String
    value: Int!
    recipe_id: String
  }
  type Rating {
    updated: String
    value: Int!
    recipe_id: String
  }
  type RecipeList {
    submitted: Boolean
    recipes: [RecipeByDay!]!
  }

  type RecipeByDay {
    weekDay: String
    servings: Int
    recipe: Recipe
  }
  type Recipe {
    uri: String
    label: String
    image: String
    source: String
    url: String
    yield: Int
    dietLabels: [String]
    healthLabels: [String]
    cautions: [String]
    ingredientLines: [String]
    ingredients: [String]
    calories: Float
    totalWeight: Float
    totalTime: Float
    totalNutritens: [Nutritents]
    totalDialy: [Nutritents]
  }

  type Nutritents {
    label: String
    quantity: Float
    unit: String
  }
  type ingredient {
    text: String
    weight: Float
  }
`;

export const recipeResolvers = {
  Query: {
    async ratings(root, { _recipeIds }) {
      const find = {};

      if (_recipeIds)
        find.recipe_id = {
          $in: [_recipeIds],
        };

      return Rating.find(find).exec();
    },
    async rating(root, { recipeId }) {
      const find = { recipe_id: recipeId };
      const rating = (await Rating.find(find).exec())[0];
      return {
        value: rating.value,
        recipe_id: rating.recipe_id,
        updated: rating.updated,
      };
    },
    async menu(root, { query }) {
      return axios.get(
        `https://api.edamam.com/search?app_id=7bcc7b18&app_key=6bf94f4c82184663f1a9e0f5ee962982&q=${query}`,
      );
    },
    async recipe(root, { query }) {
      const res = await axios.get(
        `https://api.edamam.com/search?app_id=7bcc7b18&app_key=6bf94f4c82184663f1a9e0f5ee962982&q=${query}`,
      );
      const recipes = res.data.hits.map(recipe => ({
        ...recipe.recipe,
      }));
      return recipes;
    },
    async recipesWithRating(root, { query }) {
      const recipe = await this.recipes(root, query);
      return recipe;
    },
  },

  /**
   * @example
   * mutation {
   *   addText(text: "${text}") { _id text }
   * }
   *
   * mutation {
   *   updateText(_id: "${_id}", text: "${text}") { _id text }
   * }
   *
   * mutation {
   *   deleteText(_id: "${_id}") { _id text }
   * }
   */
  Mutation: {
    async deleteRating(root, { text }) {
      return new Recipe({ text }).save();
    },
    async updateMenu(root, { _id, text }) {
      const conditions = { _id };
      const update = { $set: { text } };
      const options = { new: true, upsert: true };

      return Recipe.findOneAndUpdate(conditions, update, options).exec();
    },
    async updateRating(root, { _id }) {
      return Recipe.findByIdAndRemove(_id);
    },
  },
};
