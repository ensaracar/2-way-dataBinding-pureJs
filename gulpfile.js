// main
const gulp = require('gulp');
const sass = require('gulp-sass');
const pugLang = require('gulp-pug');
//ext
const gulpCopy = require('gulp-copy');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const rename = require("gulp-rename");
const sourcemaps = require('gulp-sourcemaps');

const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
var fontName = 'Icons';

const browserSync = require('browser-sync').create();

//scss
function icon() {
    return gulp.src(['app/assets/icons/*.svg'])
        .pipe(iconfontCss({
            fontName: fontName,
            path: 'app/assets/scss/templates/_icons.scss',
            targetPath: '../../scss/_icons.scss',
            fontPath: '../fonts/icons/',
            centerHorizontally: true
        }))
        .pipe(iconfont({
            fontName: fontName,
            fontHeight: 1001, //(>= 1000)
            normalize: true
        }))
        .pipe(gulp.dest('app/assets/fonts/icons/'));
}

function style() {
    return gulp.src('./app/assets/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error',sass.logError))
        .pipe(gulp.dest('./dist/assets/css'))
        .pipe(sass({outputStyle: 'compressed'}).on('error',sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(rename(function (path) {
            path.basename += ".min";
        }))
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
        .pipe(gulp.dest('./dist/assets/js'))
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += ".min";
        }))
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
    gulp.watch('./app/assets/scss/**/*.scss', style);
    gulp.watch('./app/assets/js/**/*.js').on('change', js);
    gulp.watch('./app/**/*.pug').on('change', pug);
}
exports.style = style;
exports.pug = pug;
exports.js = js;
exports.watch = watch;
exports.img = img;
exports.fonts = fonts;
exports.icon = icon;

gulp.task('default', exports.img);
gulp.task('server', exports.watch);
