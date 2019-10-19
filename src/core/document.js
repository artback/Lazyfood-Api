import mongoose, { Schema } from 'mongoose';

const recipeSchema = new Schema({
  uri: {
    type: String,
    required: true,
    index: true,
  },
  label: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  yield: {
    type: Number,
    required: true,
  },
  dietLabels: [
    {
      type: String,
    },
  ],
  healthLabels: [{ type: String }],
  cautions: [{ type: String }],
  ingredientLines: [{ type: String }],
  ingredients: [{ type: String }],
  calories: {
    type: Number,
  },
  totalWeight: { type: Number },
  totalTime: {
    type: Number,
  },
  totalNutrients: [
    {
      label: { type: String },
      quantity: { type: Number },
      unit: { type: Number },
    },
  ],
  totalDaily: [
    {
      label: { type: String },
      quantity: { type: Number },
      unit: { type: Number },
    },
  ],
});

const ratingSchema = new Schema({
  value: { type: Number, required: true },
  recipe_id: { type: String, required: true, index: true },
  username: { type: String, required: true},
});
ratingSchema.index({
  recipe_id: 1, username: 1
});

const menuSchema = new Schema({
  week_year: { type: String, required: true, index: true },
  recipes: [
    {
      type: String,
    },
  ],
});

export const Recipe = mongoose.model('Recipe', recipeSchema);

export const Rating = mongoose.model('Rating', ratingSchema);
export const Menu = mongoose.model('Menu', menuSchema);
