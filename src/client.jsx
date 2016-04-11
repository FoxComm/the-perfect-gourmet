import React from 'react';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import makeStore from './store';
import routes from './routes';
import I18nProvider from 'lib/i18n/provider';

const DEBUG = true;

export function renderApp() {
  const store = makeStore(browserHistory, window.__data);

  if (DEBUG) {
    window.store = store;
  }

  const {language, translation} = window.__i18n;

  render((
    <I18nProvider locale={language} translation={translation}>
      <Provider store={store} key="provider">
        <Router history={browserHistory}>
          {routes}
        </Router>
      </Provider>
    </I18nProvider>
  ), document.getElementById('app'));
}
