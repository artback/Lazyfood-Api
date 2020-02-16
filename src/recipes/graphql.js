import gql from 'graphql-tag';

import axios from 'axios';
import { Menu, Rating } from '../core/document';
import { RECIPE } from '~/env';
import weeklist from './weekList';

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
    id: String
    title: String
    readyInMinutes: Int
    servings: Int
    image: String
    imageUrls: [String]
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
    async rating(root, { recipeId }, context) {
      const find = { recipe_id: recipeId, user_id: context.user.id };
      const rating = (await Rating.find(find).exec())[0];
      return {
        value: rating.value,
        recipe_id: rating.recipe_id,
        updated: rating.updated,
      };
    },
    async menu(root, { yearWeek }, context) {
      const menu = await Menu.findOne({
        year_week: yearWeek.toString(),
        user_id: context.id,
      });
      if (menu) {
        return menu;
      }
      const random = await weeklist(context.user.id);
      return random.map(r =>
        axios.get(`${RECIPE.URL}recipes/${r.id}?${RECIPE.apiKey}`),
      );
    },
    async recipes(root, { query }) {
      const res = await axios.get(`${RECIPE.SEARCH}&query=${query}`);
      const recipes = res.data.hits.map(recipe => ({
        ...recipe.recipe,
      }));
      return recipes;
    },
    async recipesWithRatings(root, { query }) {
      const recipe = await this.recipes(root, query);
      return recipe;
    },
  },

  Mutation: {
    async deleteRating(root, { recipeId }, context) {
      const query = { recipe_id: recipeId, user_id: context.user.id };
      return Rating.findOneAndDelete(query);
    },
    async updateMenu(root, { weekYear, menu }, context) {
      const query = { week_year: weekYear, user_id: context.user.id };
      const update = { menu };
      const options = { new: true, upsert: true };
      return Menu.findOneAndUpdate(query, update, options).exec();
    },
    async updateRating(root, { recipeId, rating }, context) {
      const query = { recipe_id: recipeId, user_id: context.user.id };
      const options = { upsert: true, new: true };
      const update = { value: rating, updated: Date.now() };
      return Rating.findOneAndUpdate(query, update, options);
    },
  },
};
