/* @flow */

import { createReducer } from 'redux-act';
import createAsyncActions from './async-utils';

const _fetchOrders = createAsyncActions(
  'fetchOrders',
  function() {
    return this.api.orders.list();
  }
);

export const fetchOrders = _fetchOrders.perform;

const initialState = {
  list: {},
};

const reducer = createReducer({
  [_fetchOrders.succeeded]: (state, response) => {
    return {
      ...state,
      list: response,
    };
  },
}, initialState);

export default reducer;
