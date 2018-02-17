var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var stylus = require('gulp-stylus');
var browserSync = require('browser-sync').create();
var babel = require('gulp-babel');

gulp.task('styles', function() {
  return gulp.src('./assets/*.styl')
    .pipe(stylus())
    .pipe(autoprefixer({
      browsers: ['last 30 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./css/'));
});

gulp.task('babel', function() {
  return gulp.src('./assets/*.js')
  .pipe(babel({
      presets: ['es2015']
  }))
  .pipe(gulp.dest('./js/'))
});

gulp.task('serve', ['styles'], function() {
  
  browserSync.init({ 
    server: { baseDir: './' }, 
    port: 4000 
  });

  gulp.watch("./assets/*.styl", ['styles']);
  gulp.watch("./assets/*.js", ['babel']);
  gulp.watch("./*.html").on('change', browserSync.reload);

});

gulp.task('default', ['serve', 'styles']);