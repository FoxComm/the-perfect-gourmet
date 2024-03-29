
const fs = require('fs');
const dot = require('dot');
const through = require('through2');

/* eslint no-param-reassign:0 */

module.exports = function(gulp) {
  const src = 'src/templates/main.html';

  gulp.task('templates', ['sprites'], function() {
    gulp.src(src)
      .pipe(through.obj((file, enc, cb) => {
        const fn = dot.template(
          file.contents.toString(),
          Object.assign({selfcontained: true}, dot.templateSettings),
          {
            tpgSprite: String(fs.readFileSync('build/svg/fc-sprite.svg')),
            fcSprite: String(fs.readFileSync('node_modules/@foxcomm/storefront-react/tpg/sprite.svg')),
          }
        ).toString();
        file.contents = new Buffer(`module.exports = ${fn}`);
        file.path += '.js';
        cb(null, file);
      }))
      .pipe(gulp.dest('build'));
  });

  gulp.task('templates.watch', function() {
    gulp.watch([src], ['templates']);
  });
};
