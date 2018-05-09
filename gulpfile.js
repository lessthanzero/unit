var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var stylus = require('gulp-stylus');
var browserSync = require('browser-sync').create();
var babel = require('gulp-babel');
var minify = require('gulp-minify');

gulp.task('styles', function() {
  return gulp.src(['./assets/*.styl', './assets/*.css'])
    .pipe(stylus())
    .pipe(autoprefixer({
      browsers: ['last 30 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./css/'));
});

gulp.task('compress', function() {
  gulp.src('assets/*.js')
  .pipe(minify({
    ext: {
      src: '.js',
      min: '.min.js'
    },
    ignoreFiles: ['*.min.js', '-min.js'],
  }))
  .pipe(gulp.dest('js'))
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

gulp.task('default', ['serve', 'styles', 'compress']);