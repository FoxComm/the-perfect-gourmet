const path = require('path');

process.env.NODE_PATH = `${process.env.NODE_PATH}:${path.resolve('./lib/core')}`;

require('./postcss.config').installHook();

const makeRoutes = require('./lib/routes').default;
const Sitemap = require('react-router-sitemap').default;
const {
  categories,
  convertCategoryNameToUrlPart,
} = require('modules/categories');

const routes = makeRoutes();
const categoryNames = categories.map(c => convertCategoryNameToUrlPart(c.name));

const paramsConfig = {
  '/:categoryName': [
    {
      categoryName: encodeURIComponent('ENTRÉES'),
    },
    {
      categoryName: categoryNames,
    },
  ],
};

const excludedRoutes = {
  isValid: false,
  rules: [
    /\/login/,
    /\/restore-password/,
    /\/reset-password/,
    /\/profile/,
    /\/products/,
    /\/search/,
    /\/checkout/,
  ],
};

new Sitemap(routes)
  .filterPaths(excludedRoutes)
  .applyParams(paramsConfig)
  .build('https://theperfectgourmet.com')
  .save('./public/sitemap.xml');
