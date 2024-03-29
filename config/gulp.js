
const fs = require('fs');

exports.enableNotifier = true;

// install pre-push hooks
// exports.autoInstallHooks = true;

if (fs.existsSync('./.gulprc')) {
  Object.assign(exports, require('../.gulprc')); // eslint-disable-line import/no-unresolved
}

if (process.argv.indexOf('--browser-sync') >= 0) {
  exports.enableBrowserSync = true;
}
