// main
const gulp = require('gulp');
const sass = require('gulp-sass');
const pugLang = require('gulp-pug');
//ext
const gulpCopy = require('gulp-copy');
const uglify = require('gulp-uglify');
var pipeline = require('readable-stream').pipeline;
const imagemin = require('gulp-imagemin');


const browserSync = require('browser-sync').create();
//scss
function style() {
    return gulp.src('./app/assets/scss/**/*.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(gulp.dest('./dist/assets/css'))
        .pipe(browserSync.stream());
}
//pug
function pug() {
    return gulp
        .src('./app/**/*.pug')
        .pipe(pugLang({
            pretty: true // Comment this to get minified HTML
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
}
//copy
function img() {
    return gulp
        .src(['./app/assets/img/**/*','./app/assets/svg/**/*'])
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: false},
                    {cleanupIDs: true}
                ]
            })
        ]))
        .pipe(gulp.dest('./dist/assets/img'))
        .pipe(browserSync.stream());
}
function fonts() {
    return gulp
        .src('./app/assets/fonts/**/*')
        .pipe(gulp.dest('./dist/assets/fonts'))
        .pipe(browserSync.stream());
}
function js() {
    gulp
        .src('./app/assets/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/assets/js'))
        .pipe(browserSync.stream())
}


browserSync.init({
    server: {
        baseDir: "./dist",
        index: "/index.html"
    }
});

function watch() {
    gulp.watch('./app/assets/scss/**/*.scss', style)
    gulp.watch('./app/assets/js/**/*.js').on('change', js);
    gulp.watch('./app/**/*.pug').on('change', pug);
}
exports.style = style;
exports.pug = pug;
exports.js = js;
exports.watch = watch;
exports.img = img;
exports.fonts = fonts;

gulp.task('default', exports.img);
gulp.task('server', exports.watch);
