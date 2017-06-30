import _ from 'lodash';
import React from 'react';
import { Router, applyRouterMiddleware } from 'react-router';
import { browserHistory } from 'lib/history';

import useScroll from 'react-router-scroll';
import { render } from 'react-dom';
import makeStore from './store';
import makeRoutes from './routes';
import App from './app';
import { initTracker, trackPageView } from 'lib/analytics';

const DEBUG = process.env.NODE_ENV != 'production';
import { api } from 'lib/api';


function scrollHandler(prevRouterProps, { params }) {
  // do not scroll page to top if product type was selected in dropdown menu
  if (params.categoryName && params.productType) {
    return false;
  }

  return true;
}

export function renderApp() {
  const history = browserHistory;
  const store = makeStore(history, window.__data);
  const routes = makeRoutes(store);

  if (DEBUG) {
    window.store = store;
    window.foxApi = api;
  }

  const userId = _.get(store.getState(), 'state.auth.user.id');
  initTracker(userId);

  history.listenBefore((location) => {
    trackPageView(location.pathname);
  });

  const {language, translation} = window.__i18n;

  render((
    <App language={language} translation={translation} store={store}>
      <Router history={history} render={applyRouterMiddleware(useScroll(scrollHandler))}>
        {routes}
      </Router>
    </App>
  ), document.getElementById('app'));
}
