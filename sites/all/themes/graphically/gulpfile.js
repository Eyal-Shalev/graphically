var gulp = require('gulp');

gulp.task('default', function() {
  // place code for your default task here
});

var target = require('gulp-css-target');

// Same Directory
gulp.task('target', function () {
  return gulp.src('css/**/*.css')
    .pipe(target())
    .pipe(gulp.dest('css/'));
});

// New Directory
gulp.task('target-new', function () {
  return gulp.src('css/**/*.css')
    .pipe(target({
      base: 'output'
    }))
    .pipe(gulp.dest('output/'));
});