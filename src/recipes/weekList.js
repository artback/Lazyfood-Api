import { Rating } from '../core/document';

const wa = require('weighted-arrays');

const weekDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const getWeightBasedOnDaysAndValue = obj =>
  new Date(Date.now() - new Date(obj.updated)).getDay() + obj.value;

const get7NewRecipes = ratings => {
  const randomizedWeekList = [];
  while (randomizedWeekList.length < 7) {
    const random = wa.random(ratings, getWeightBasedOnDaysAndValue);
    random.weekday = weekDays[randomizedWeekList.length];
    randomizedWeekList.push(random);
    random.updated = new Date().toISOString();
  }
  return randomizedWeekList;
};
const get7Recipes = async user_id => {
  const ratings = await Rating.find({ user_id });
  return get7NewRecipes(ratings);
};

export default get7Recipes;
