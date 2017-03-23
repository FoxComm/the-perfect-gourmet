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
    imageUrl: '/images/categories/Cat_Entrees_2x.jpg',
    showNameCatPage: true,
  },
  {
    id: nextCategoryId++,
    name: 'NEW',
    description: 'NEW ON THE MENU',
    imageUrl: '/images/categories/Cat_New.jpg',
    showNameCatPage: false,
    hiddenInNavigation: true,
  },
  {
    id: nextCategoryId++,
    name: 'SPRING',
    description: 'SPRING PICKS',
    imageUrl: '/images/categories/Cat_Spring.jpg',
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
    // TODO: REMOVE THIS CODE AFTER Feb 15
    id: nextCategoryId++,
    name: 'VALENTINE',
    description: 'Valentine\'s Day Picks',
    imageUrl: '/images/categories/Cat_Valentine_2x.jpg',
    hiddenInNavigation: true,
    showNameCatPage: false,
  },
  {
    id: nextCategoryId++,
    name: 'WEEKNIGHT',
    description: 'Weeknight Favorites',
    imageUrl: '/images/categories/Cat_Weeknights_2x.jpg',
    hiddenInNavigation: true,
    showNameCatPage: false,
  },
  {
    id: nextCategoryId++,
    name: 'SPIN',
    description: 'Classics Revisited',
    imageUrl: '/images/categories/Cat_Spin_2x.jpg',
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
