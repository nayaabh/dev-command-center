'use strict';

var gulp = require('gulp');
var electron = require('electron-connect').server.create();

gulp.task('serve', function () {

  // Start browser process
  electron.start();

  // Restart browser process
  gulp.watch('application.js', electron.restart);

  // Reload renderer process
  gulp.watch(['**/*.js', '**/*.html'], electron.reload);
});