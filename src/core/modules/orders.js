/* @flow */

import { createReducer, createAction } from 'redux-act';
import createAsyncActions from './async-utils';

export const clearOrder = createAction('ORDERS_CLEAR_ONE');

const _fetchOrders = createAsyncActions(
  'fetchOrders',
  function() {
    return this.api.orders.list();
  }
);

const _fetchOrder = createAsyncActions(
  'fetchOrder',
  function() {
    return new Promise(resolve => {
      const orderData = require('./mock/order.json');
      resolve(orderData.result);
    });
    // return this.api.orders.get(referenceNumber);
  }
);

export const fetchOrders = _fetchOrders.perform;
export const fetchOrder = _fetchOrder.perform;

const initialState = {
  current: null,
  list: {},
};

const reducer = createReducer({
  [_fetchOrders.succeeded]: (state, response) => {
    return {
      ...state,
      list: response,
    };
  },
  [_fetchOrder.succeeded]: (state, response) => {
    return {
      ...state,
      current: response,
    };
  },
  [clearOrder]: state => {
    return {
      ...state,
      current: null,
    };
  },
}, initialState);

export default reducer;
