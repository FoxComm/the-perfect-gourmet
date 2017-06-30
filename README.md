# The Perfect Gourmet

[![Build status](https://badge.buildkite.com/99167bb0d9f818e7018b5bea587dceb9c7540912eda5e4669b.svg)](https://buildkite.com/foxcommerce/the-perfect-gourmet)

The Perfect Gourmet store. Isomorphic React app powered by FoxComm's backend API.

## Local Development

### Prerequisites

* `node` > v5.1.0

  To install this or another versions of node you can use [brew](http://brew.sh), [n](https://github.com/tj/n) or [nvm](https://github.com/creationix/nvm)

* `yarn` > v0.17.8

* [Flow](http://flowtype.org)

  We're using [Flow](http://flowtype.org) to perform type checks and `babel-plugin-typecheck` for same thing at runtime. Checkout required version in `.flowconfig` file.

* `public_key.pem` in the root of the project, as described in the [engineering wiki](https://github.com/FoxComm/engineering-wiki/blob/master/development/setup.md#developing-frontend-applications)

### Run the dev server

1. Run `yarn` to install dependencies.

1. Set Stripe.js publishable key.
In order to checkout to work you should set Stripe key by exporting `STRIPE_PUBLISHABLE_KEY` variable, or setting it in your `.env` file if you're using foreman, or run dev command with it:

  `export STRIPE_PUBLISHABLE_KEY=pk_test_JvTXpI3DrkV6QwdcmZarmlfk`

  `STRIPE_PUBLISHABLE_KEY=pk_test_JvTXpI3DrkV6QwdcmZarmlfk npm run dev`

1. Set DEV_SKIP_JWT_VERIFY, or configure PHOENIX_PUBLIC_KEY variable for verifying jwt token.

  `export DEV_SKIP_JWT_VERIFY=1`

  `DEV_SKIP_JWT_VERIFY=1 STRIPE_PUBLISHABLE_KEY=pk_test_JvTXpI3DrkV6QwdcmZarmlfk npm run dev`

1. Select your API backend. There are convenience tasks to run the common backend development methods, hitting backend API at remote stage:

  `npm run dev` — backend API at `API_URL` env variable

1. Develop it at http://localhost:4044/

1. Use `--browser-sync` flag to enable CSS hot reloading:

`npm run dev -- --browser-sync`, then open `http://localhost:3000`


You can set the backend API URL as a shell variable `API_URL`.

For example, to hit staging:

```
export API_URL=http://10.240.0.8
```
then run

```
npm run dev
```

1.  Be sure to add a Google Analytics ID via the environment variable `GA_TRACKING_ID`

For example, you might set a customer test/staging ID:

```
export GA_TRACKING_ID=UA-74320XXX-X
npm run dev
```

## Push hooks

By default, gulpfile installs pre-push hooks for you.
And, usually, it's ok having pre-push hooks, even if you needed to push broken branch
you can push with `--no-verify` option.
Also, you can disable auto installing hooks by creating `.gulprc` in project root with following content:

```
exports.autoInstallHooks = false;
```

## Base infrastructure

For achieve right isomorphism [redux-isomorphic-render](https://www.npmjs.com/package/redux-isomorphic-render) is used.
It utilizes multiple rendering calls for get all async dependencies for project.
Read about code organization limitations in redux-isomorphic-render's README.

For **grids** [lost](https://www.npmjs.com/package/lost) postcss plugin is used. It's really good if you need complex
 grid layouts.
For different margins which depends on viewport size use `--grid-margin` css variable: `margin: 0 var(--grid-margin)`.

For **static type checking** [flowtype](http://flowtype.org/) is used. You can run check manually by `yarn flow` 
command.

For **icons** svg icons is used. Just place svg icon to `src/images/svg` folder and gulp sprites task builds sprite for you
automatically. Name for each icon in a sprite will be `tpg-icon-<file-name-lowecased>` Usage:

```jsx
import { Icon } from '@foxcomm/storefront-react';

const icon = <Icon name="<file-name-lowercased>" prefix="tpg-icon-" />;
```

Or in case using strorefront-react's icon:

```jsx
import { Icon } from '@foxcomm/storefront-react';

const icon = <Icon name="add" />;
```

![Firebird and Phoenix](http://i.imgur.com/7Cyj5q8.jpg "Firebird and Phoenix")
