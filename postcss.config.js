const _ = require('lodash');
const crypto = require('crypto');
const path = require('path');
const storefrontPostcssConfig = require('@foxcomm/storefront-react/postcss.config');

function generateLongName(exportedName, filepath) {
  const sanitisedPath = path.relative(process.cwd(), filepath)
    .replace('src/components', '')
    .replace(/\.[^\.\/\\]+$/, '')
    .replace(/[\W_]+/g, '_')
    .replace(/^_|_$/g, '');
  return `_${sanitisedPath}__${exportedName}`;
}

function generateShortName (name, filename, css) {
  const i = css.indexOf(`.${name}`);
  const numLines = css.substr(0, i).split(/[\r\n]/).length;

  const hash = crypto.createHash('md5').update(css).digest('hex').substr(0, 5);
  return `_${name}_${hash}_${numLines}`;
}

const isProduction = process.env.NODE_ENV === 'production';

function configurePlugins(options = {}) {
  let generateScopedName;
  if (options.forTheming) {
    generateScopedName = storefrontPostcssConfig.generateScopedName;
  } else {
    generateScopedName = isProduction ? generateShortName : generateLongName;
  }
  return _.compact([
    require('postcss-import')({
      path: ['src/css', 'node_modules'],
    }),
    require('postcss-css-variables'),
    require('lost')({
      flexbox: 'flex',
      gutter: '2.4%',
    }),
    !options.forTheming ? require('postcss-modules-extract-imports') : null,
    require('postcss-modules-local-by-default'),
    require('postcss-modules-scope')({
      generateScopedName,
    }),
    require('postcss-cssnext')({
      features: {
        customProperties: false,
      },
    }),
    require('postcss-url')({
      url: (url) => {
        // drop leading slash in URLs to load static from prefixed environment by relative path:
        // stage.foxcommerce.com/app-name/...
        return url.startsWith('/') ? url.substr(1) : url;
      },
    }),
  ]);
}

const plugins = configurePlugins();

const pluginsNoModules = configurePlugins({
  forTheming: true,
});

exports.installHook = function() {
  const map = require('./build/css-modules.json');

  require.extensions['.css'] = function(m, filename) {
    const relativePath = path.relative(process.cwd(), filename);

    const tokens = map[relativePath];
    return m._compile(`module.exports = ${JSON.stringify(tokens)}`, filename);
  };
};

exports.plugins = plugins;
exports.pluginsNoModules = pluginsNoModules;
