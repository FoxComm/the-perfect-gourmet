
import { createReducer } from 'redux-act';
import createAsyncActions from './async-utils';

import { updateUser } from './auth';

const _fetchAccount = createAsyncActions(
  'fetchAccount',
  function() {
    return this.api.account.get();
  }
);

const _updateAccount = createAsyncActions(
  'updateAccount',
  function(payload) {
    return this.api.account.update(payload).then(account => {
      this.dispatch(updateUser(account));
      return account;
    });
  }
);

export const fetchAccount = _fetchAccount.perform;
export const updateAccount = _updateAccount.perform;

const initialState = {
  account: {},
};

function updateAccountInState(state, account) {
  return {
    ...state,
    account,
  };
}

const reducer = createReducer({
  [_fetchAccount.succeeded]: updateAccountInState,
  [_updateAccount.succeeded]: updateAccountInState,
}, initialState);

export default reducer;