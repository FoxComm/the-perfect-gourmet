
import { createReducer } from 'redux-act';
import createAsyncActions from './async-utils';

const _fetchAccount = createAsyncActions(
  'fetchAccount',
  function() {
    return this.api.account.get();
  }
);

export const fetchAccount = _fetchAccount.perform;

const initialState = {
  account: {},
};

const reducer = createReducer({
  [_fetchAccount.succeeded]: (state, account) => {
    return {
      ...state,
      account,
    };
  },
}, initialState);

export default reducer;
