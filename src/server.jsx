import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import createHistory from 'history/lib/createMemoryHistory';
import { useQueries, useBasename } from 'history';

import makeStore from './store';
import makeRoutes from './routes';
import App from './app';
import renderPage from '../build/main.html'; // eslint-disable-line import/no-unresolved

const createServerHistory = useQueries(useBasename(createHistory));

function getAssetsNames() {
  let appJs = 'app.js';
  let appCss = 'app.css';

  if (process.env.NODE_ENV === 'production') {
    const revManifest = require('../build/rev-manifest.json'); // eslint-disable-line import/no-unresolved

    appJs = revManifest['app.js'];
    appCss = revManifest['app.css'];
  }

  return { appJs, appCss };
}

const assetsNames = getAssetsNames();

export function* renderReact() {
  const history = createServerHistory({
    entries: [this.url],
    basename: process.env.URL_PREFIX || null,
  });

  const authHeader = this.get('Authorization');

  const { auth, i18n } = this.state;
  const initialState = auth ? {auth} : {};
  if (authHeader) initialState.authHeader = authHeader;

  const store = makeStore(history, initialState);
  const routes = makeRoutes(store);

  const [redirectLocation, renderProps] = yield match.bind(null, { routes, location: this.url, history });

  if (redirectLocation) {
    this.redirect(redirectLocation.pathname + redirectLocation.search);
  } else if (!renderProps) {
    this.status = 404;
  } else {
    const rootElement = (
      <App language={i18n.language} translation={i18n.translation} store={store}>
        <RouterContext {...renderProps} />
      </App>
    );

    const appHtml = yield store.renderToString(renderToString, rootElement);
    const { appJs, appCss } = assetsNames;

    this.body = renderPage({
      html: appHtml,
      state: JSON.stringify(store.getState()),
      i18n: JSON.stringify(i18n),
      appJs,
      appCss,
      urlPrefix: process.env.URL_PREFIX,
      env: JSON.stringify({
        URL_PREFIX: process.env.URL_PREFIX,
        STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || null,
        GA_TRACKING_ID: process.env.GA_TRACKING_ID,
        FB_PIXEL_ID: process.env.FB_PIXEL_ID,
        // use GA_LOCAL=1 gulp dev command for enable tracking events in google analytics from localhost
        GA_LOCAL: process.env.GA_LOCAL,
        IMGIX_PRODUCTS_SOURCE: process.env.IMGIX_PRODUCTS_SOURCE,
        S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
        S3_BUCKET_PREFIX: process.env.S3_BUCKET_PREFIX,
      }),
    });
  }
}
