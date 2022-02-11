'use strict';

const csso = require('gulp-csso');
const gulp = require('gulp');
const rename = require('gulp-rename');
const terser = require('gulp-terser');
const sass = require('gulp-sass')(require('sass'));

gulp.task('cssFile', function() {
	return gulp.src('./css/feedybacky.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(csso())
		.pipe(rename('feedybacky.min.css'))
		.pipe(gulp.dest('./css'))
});

gulp.task('jsFile', function() { 
	return gulp.src('./js/feedybacky.js')
		.pipe(rename('feedybacky.min.js'))
		.pipe(terser())
		.pipe(gulp.dest('./js'))
});

const tasks = ['cssFile', 'jsFile'];

gulp.task('default', gulp.parallel(...tasks));
gulp.task('watch', () => {
	gulp.watch(['./css/feedybacky.scss', './js/feedybacky.js'], gulp.parallel(...tasks));
});