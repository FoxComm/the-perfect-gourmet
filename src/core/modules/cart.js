/* @flow weak */

import _ from 'lodash';
import { createAction, createReducer } from 'redux-act';
import { createAsyncActions } from 'wings';
import { api as foxApi } from 'lib/api';

export const toggleCart = createAction('TOGGLE_CART');
export const hideCart = createAction('HIDE_CART');
export const updateCart = createAction('UPDATE_CART');
export const selectCreditCard = createAction('CART_SET_CREDIT_CARD');
export const resetCreditCard = createAction('CART_RESET_CREDIT_CARD');
export const resetCart = createAction('RESET_CART');

export type ProductInCart = {
  skuId: number;
  quantity: number;
  imagePath: string;
  referenceNumbers: Array<string>;
  name: string;
  skuId: number;
  price: number;
  quantity: number;
  totalPrice: number;
  state: string;
};

type Totals = {
  subTotal: number;
  taxes: number;
  shipping: number;
  adjustments: number;
  total: number;
}

type FormData = {
  isVisible: boolean;
  totals: Totals;
  skus: Array<ProductInCart>;
};

// reduce SKU list
function collectLineItems(skus) {
  return _.map(skus, (s) => {
    const totalPrice = s.quantity * s.price;
    return {
      ...s,
      totalPrice,
    };
  });
}

// get line items from response
function getLineItems(payload) {
  const skus = _.get(payload, ['lineItems', 'skus'], []);
  const reducedSkus = collectLineItems(skus);
  return reducedSkus;
}

// collect line items to submit change
function addToLineItems(items, skuId, quantity, attributes) {
  return items.concat([{ skuId, quantity, attributes }]);
}

function changeCartLineItems(payload) {
  return this.api.post('/v1/my/cart/line-items', payload);
}

const { fetch: submitLineItemChange, ...changeCartActions } = createAsyncActions('cartChange', changeCartLineItems);

// add line item to cart
export function addLineItem(skuId, quantity, attributes = {}) {
  return (dispatch, getState) => {
    const state = getState();
    const lineItems = _.get(state, ['cart', 'skus'], []);
    const newLineItems = addToLineItems(lineItems, skuId, quantity, attributes);
    return dispatch(submitLineItemChange(newLineItems));
  };
}

// update line item quantity
export function updateLineItemQuantity(skuId, qtt) {
  return (dispatch, getState) => {
    const state = getState();
    const lineItems = _.get(state, ['cart', 'skus'], []);
    const newLineItems = _.map(lineItems, (item) => {
      const quantity = item.skuId === skuId ? parseInt(qtt, 10) : item.quantity;
      return {
        ...item,
        quantity,
      };
    });
    return dispatch(submitLineItemChange(newLineItems));
  };
}

// remove item from cart
export function deleteLineItem(skuId) {
  return updateLineItemQuantity(skuId, 0);
}

function fetchMyCart(user): global.Promise {
  const api = user ? foxApi : foxApi.removeAuth();
  return api.cart.get();
}

// push cart to server
export function saveLineItemsAndCoupons(merge: boolean = false) {
  return (dispatch, getState) => {
    const state = getState();
    const guestLineItems = _.get(state, ['cart', 'skus'], []);
    const guestCouponCode = _.get(state, 'cart.coupon.code', null);
    return fetchMyCart().then((data) => {
      let newCartItems = [];

      // We are merging a guest cart what is already persisted for this user (because they are logging in).
      if (merge) {
        const persistedLineItems = _.get(data, 'lineItems.skus', []);

        const originalCart = _.map(persistedLineItems, item => {
          const itemInNewCart = _.find(guestLineItems, { skuId: item.skuId });

          if (itemInNewCart) {
            const originalItemQuantity = item.quantity;
            const guestItemQuantity = itemInNewCart.quantity;
            const sum = originalItemQuantity + guestItemQuantity;
            return { skuId: item.skuId, quantity: sum };
          }

          return item;
        });

        const originalCartSkus = _.map(originalCart, li => li.skuId);
        const guestCartSkus = _.reduce(guestLineItems, (acc, item) => {
          if (originalCartSkus.indexOf(item.skuId) >= 0) {
            return acc;
          }

          return acc.concat(item);
        }, []);

        newCartItems = originalCart.concat(guestCartSkus);

        // We are going to only persist the items in the guest cart on the case of signup.
        // We will delete any items that are persisted, although there should be no persisted items for a freshly signed-up user.
      } else {
        const lis = _.get(data, 'lineItems.skus', []);
        const newSkus = _.map(guestLineItems, li => li.skuId);
        const oldSkus = _.map(lis, li => li.skuId);

        const toDelete = _.difference(oldSkus, newSkus);

        const itemsToDelete = _.map(toDelete, skuId => {
          return {
            skuId,
            quantity: 0,
          };
        });

        newCartItems = guestLineItems.concat(itemsToDelete);
      }

      return newCartItems;
    }).then((newCartItems) => {
      return dispatch(submitLineItemChange(newCartItems));
    }).then(() => {
      if (!_.isNil(guestCouponCode)) {
        foxApi.cart.addCoupon(guestCouponCode)
          .then(res => {
            dispatch(updateCart(res.result));
          });
      }
    });
  };
}

const {fetch, ...actions} = createAsyncActions('cart', fetchMyCart);

const initialState: FormData = {
  isVisible: false,
  skus: [],
  quantity: 0,
  totals: {
    subTotal: 0,
    taxes: 0,
    shipping: 0,
    adjustments: 0,
    total: 0,
  },
};

function totalSkuQuantity(cart) {
  return _.reduce(cart.lineItems.skus, (sum, sku) => {
    return sum + sku.quantity;
  }, 0);
}

function updateCartState(state, cart) {
  const data = getLineItems(cart);
  const quantity = totalSkuQuantity(cart);
  const shippingAddress = _.get(cart, 'shippingAddress', {});

  return {
    ...state,
    skus: data,
    quantity,
    shippingAddress,
    ...cart,
  };
}

const reducer = createReducer({
  [toggleCart]: state => {
    const currentState = _.get(state, 'isVisible', false);
    return {
      ...state,
      isVisible: !currentState,
    };
  },
  [hideCart]: state => {
    return {
      ...state,
      isVisible: false,
    };
  },
  [changeCartActions.succeeded]: (state, { result }) => {
    const data = getLineItems(result);
    const quantity = totalSkuQuantity(result);
    const totals = _.get(result, ['totals'], {});
    return {
      ...state,
      totals,
      quantity,
      skus: data,
    };
  },
  [actions.succeeded]: updateCartState,
  [updateCart]: updateCartState,
  [selectCreditCard]: (state, creditCard) => {
    return {
      ...state,
      creditCard,
    };
  },
  [resetCreditCard]: (state) => {
    return {
      ...state,
      creditCard: null,
    };
  },
  [resetCart]: () => {
    return initialState;
  },
}, initialState);

export {
  fetch,
  reducer as default,
};
