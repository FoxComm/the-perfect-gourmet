const browserSync = require('browser-sync');

module.exports = gulp => {
  gulp.task('browserSync', ['browserify'], function () {
    browserSync.init(['build/bundle.css', 'src/**/*.js', 'src/**/*.jsx'], {
      proxy: 'http://localhost:4044',
      open: false,
    });
  });
};
