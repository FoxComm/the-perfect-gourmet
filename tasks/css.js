const browserSync = require('browser-sync');
const cssnano = require('gulp-cssnano');
const _if = require('gulp-if');

module.exports = function(gulp, $) {
  const src = [
    'src/css/fonts.css',
    'src/css/reset.css',
    'src/css/inputs.css',
    'node_modules/@foxcomm/wings/lib/bundle.css',
    'node_modules/@foxcomm/storefront-react/tpg/bundle.css',
    'build/theme.css',
    'build/bundle.css',
    'node_modules/slick-carousel/slick/slick.css',
    'node_modules/slick-carousel/slick/slick-theme.css',
  ];

  gulp.task('css', ['css-theme'], function() {
    return gulp.src(src)
      .pipe($.concat('app.css'))
      .pipe(_if(process.env.NODE_ENV === 'production', cssnano()))
      .pipe(gulp.dest('public'))
      .pipe(browserSync.stream({ match: '**/*.css' }));
  });

  const srcTheme = [
    'src/theme/**/*.css',
  ];

  gulp.task('css-theme', () => {
    const postcss = require('gulp-postcss');
    const plugins = require('../postcss.config').pluginsNoModules;

    return gulp
      .src(srcTheme)
      .pipe(postcss(plugins))
      .pipe($.concat('theme.css'))
      .pipe(gulp.dest('build/'));
  });

  gulp.task('css.watch', function() {
    gulp.watch([...src, ...srcTheme], ['css']);
  });
};
