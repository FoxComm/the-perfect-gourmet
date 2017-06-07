/* @flow */

import { createReducer } from 'redux-act';
import { createAsyncActions } from '@foxcomm/wings';

let nextCategoryId = 0;

const categories = [
  {
    id: nextCategoryId++,
    name: 'APPETIZERS',
    description: 'Starters in 10 Minutes',
    imageUrl: '/images/categories/Cat_Appetizers_2x.jpg',
    showNameCatPage: true,
  },
  {
    id: nextCategoryId++,
    name: 'ENTRÉES',
    description: 'Dinner in 30 minutes',
    imageUrl: '/images/categories/May_Section1.jpg',
    showNameCatPage: true,
  },
  {
    id: nextCategoryId++,
    name: 'NEW',
    description: 'NEW ITEMS',
    imageUrl: '/images/categories/May_Section3.jpg',
    showNameCatPage: false,
    hiddenInNavigation: true,
  },
  {
    id: nextCategoryId++,
    name: 'SPRING',
    description: 'THE SPRING COLLECTION',
    imageUrl: '/images/categories/April15_Spring.jpg',
    showNameCatPage: false,
    hiddenInNavigation: true,
  },
  {
    id: nextCategoryId++,
    name: 'SIDES',
    description: '',
    imageUrl: '/images/categories/Cat_Sides_2x.jpg',
    showNameCatPage: true,
  },
  {
    id: nextCategoryId++,
    name: 'BEST SELLERS',
    description: 'Dinner in 30 minutes',
    imageUrl: '/images/categories/Cat_Best_Sellers_2x.jpg',
    showNameCatPage: true,
  },
  {
    id: nextCategoryId++,
    name: 'FAVORITES',
    description: 'Tried and True Favorites',
    imageUrl: '/images/categories/Cat_TriedTrue_2x.jpg',
    hiddenInNavigation: true,
    showNameCatPage: false,
  },
  {
    id: nextCategoryId++,
    name: 'GIFT CARDS',
    description: 'Gift cards will be here',
    imageUrl: '',
    showNameCatPage: true,
  },
  {
    id: nextCategoryId++,
    name: 'SUMMER',
    description: 'SUMMER FAVORITES',
    imageUrl: '/images/categories/Cat_Hero_Summer.jpg',
    hiddenInNavigation: true,
    showNameCatPage: false,
  },
  {
    id: nextCategoryId++,
    name: 'DAD',
    description: 'Father’s Day Favorites',
    imageUrl: '/images/categories/Cat_Hero_Dad.jpg',
    hiddenInNavigation: true,
    showNameCatPage: false,
  },
];

const productTypes = [
  'All',
  'Poultry',
  'Seafood',
  'Meat',
  'Vegetarian',
];

function convertCategoryNameToUrlPart(categoryName: string) {
  return encodeURIComponent(categoryName.replace(/\s/g, '-'));
}

const initialState = {
  list: [],
};
const {fetch, ...actions} = createAsyncActions(
  'categories',
  () => Promise.resolve(categories)
);

const reducer = createReducer({
  [actions.succeeded]: (state, payload) => {
    return {
      ...state,
      list: payload,
    };
  },
}, initialState);

export {
  reducer as default,
  fetch,
  categories,
  productTypes,
  convertCategoryNameToUrlPart,
};
