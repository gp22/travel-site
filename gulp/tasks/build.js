'use strict';

const browserSync = require('browser-sync').create(),
imagemin = require('gulp-imagemin'),
cssnano = require('gulp-cssnano'),
usemin = require('gulp-usemin'),
uglify = require('gulp-uglify'),
rev = require('gulp-rev'),
gulp = require('gulp'),
del = require('del');

// Spin up a preview server that uses the docs folder as the base
gulp.task('previewDist', function() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: 'docs'
    }
  });
});

// Delete the entire docs folder
gulp.task('deleteDistFolder', ['icons'], function() {
  return del('./docs');
});

/*
Copy contents of app folder into docs folder with a few exceptions
Only do this once the deleteDistFolder task is complete
*/
gulp.task('copyGeneralFiles', ['deleteDistFolder'], function() {
  let pathsToCopy = [
    './app/**/*',
    '!./app/inex.html',
    '!./app/assets/images/**',
    '!./app/assets/styles/**',
    '!./app/assets/scripts/**',
    '!./app/temp',
    '!./app/temp/**'
  ]
  return gulp.src(pathsToCopy)
    .pipe(gulp.dest('./docs'));
});

/*
Use the imagemin package to compress all images and copy them into the /docs
folder once the deleteDistFolder dependency is done running.
*/
gulp.task('optimizeImages', ['deleteDistFolder'], function() {
  return gulp.src(['./app/assets/images/**/*', '!./app/assets/images/icons', '!./app/assets/images/icons/**/*'])
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      multipass: true
    }))
    .pipe(gulp.dest('./docs/assets/images'));
});

// Task to trigger usemin once the deleteDistFolder task has completed
gulp.task('useminTrigger', ['deleteDistFolder'], function() {
  gulp.start('usemin');
});

/*
Use the usemin package to minify files and copy them into the /docs folder
once fresh styles and scripts rebuilds have completed, that way we're sure to
get the most up to date code.
*/
gulp.task('usemin', ['styles', 'scripts'], function() {
  return gulp.src('./app/index.html')
    .pipe(usemin({
      // Revision and minify css with rev and cssnano, be sure to return them
      // so gulp is aware when they finish running
      css: [function() {return rev()}, function() {return cssnano()}],
      // Revision and minify js with rev and uglify
      js: [function() {return rev()}, function() {return uglify()}]
    }))
    .pipe(gulp.dest('./docs'));
});

// Run all tasks plus dependencies
gulp.task('build', ['deleteDistFolder', 'copyGeneralFiles', 'optimizeImages', 'useminTrigger']);
