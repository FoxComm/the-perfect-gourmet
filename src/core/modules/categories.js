/* @flow */

import { createReducer } from 'redux-act';
import { createAsyncActions } from '@foxcomm/wings';

let nextCategoryId = 0;

const categories = [
  {
    id: nextCategoryId++,
    name: 'luggage',
    imageUrl: '/images/categories/Cat_Appetizers_2x.jpg',
    showNameCatPage: true,
  },
  {
    id: nextCategoryId++,
    name: 'ENTRÉES',
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
    name: 'BRUNCH',
    description: 'BRUNCH FAVORITES',
    imageUrl: '/images/categories/April15_Brunch.jpg',
    hiddenInNavigation: true,
    showNameCatPage: false,
  },
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
  convertCategoryNameToUrlPart,
};
