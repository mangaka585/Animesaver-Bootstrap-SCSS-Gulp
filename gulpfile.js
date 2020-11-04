'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin');

gulp.task('sass', function () {
    return gulp.src('./scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./scss/*.scss', gulp.series('sass'));
});

gulp.task('browser-sync', function () {
    var files = [
        './*.html',
        './*.php',
        './css/*.css',
        './img/*.{png,jpg,gif,ico}',
        './anime/*/*.{png,jpg,gif}',
        './js/*.js'
    ];

    browserSync.init(files, {
        server: {
            baseDir: "./"
        }
    });

});

// Default task
gulp.task('default', gulp.parallel('browser-sync', 'sass:watch'));

// Clean
gulp.task('clean', function() {
    return del(['dist']);
});

gulp.task('copyfonts', function(done) {
    gulp.src(['./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*',
                './fonts/*.{ttf,woff,eof,otf,svg}*'])
        .pipe(gulp.dest('./dist/fonts'));
    done();
});

/*gulp.task('cleanCss', function () {
   return gulp.src([
       './css/*.css',
       './node_modules/bootstrap/dist/css/bootstrap.min.css',
       './node_modules/font-awesome/css/font-awesome.min.css',
       './node_modules/bootstrap-social/bootstrap-social.css'])
       .pipe(cleanCss({ level: { 1: { specialComments: 0 } } }))
       .pipe(gulp.dest('./dist/css'));
});*/

// Images
gulp.task('imagemin', function() {
    return gulp.src('img/*.{png,jpg,gif,ico}')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('imagemin-anime', function() {
    return gulp.src('anime/*/*.{png,jpg,gif}')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/anime'));
});

gulp.task('usemin', function() {
    return gulp.src('./*.html')
        .pipe(flatmap(function(stream, file){
            return stream
                .pipe(usemin({
                    css: [ rev() ],
                    html: [ function() { return htmlmin({ collapseWhitespace: true })} ],
                    js: [ uglify(), rev() ],
                    inlinejs: [ uglify() ],
                    inlinecss: [ cleanCss(), 'concat' ]
                }))
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('build',
    gulp.series('clean',
        gulp.parallel(
            'copyfonts',
            'imagemin',
            'imagemin-anime',
            'usemin'
        )
    )
);
