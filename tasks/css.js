const browserSync = require('browser-sync');

module.exports = function(gulp, $) {
  const src = [
    'node_modules/evil-icons/assets/evil-icons.css',
    'node_modules/wings/lib/bundle.css',
    'build/bundle.css',
    'src/**/*.css',
  ];

  gulp.task('css', function() {
    return gulp.src(src)
      .pipe($.concat('app.css'))
      .pipe(gulp.dest('public'))
      .pipe(browserSync.stream({ match: '**/*.css' }));
  });

  gulp.task('css.watch', function() {
    gulp.watch(src, ['css']);
  });
};
