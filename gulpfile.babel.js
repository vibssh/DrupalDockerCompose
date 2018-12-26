let gulp = require('gulp');
let browserify  = require('browserify');
let source      = require('vinyl-source-stream');
let buffer      = require('vinyl-buffer');
let uglify      = require('gulp-uglify');
let livereload = require('gulp-livereload');
let sass = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let sourcemaps = require('gulp-sourcemaps');
let imagemin = require('gulp-imagemin');
let pngquant = require('imagemin-pngquant');

gulp.task('imagemin', () => {
    return gulp.src('./themes/custom/luke/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./themes/custom/luke/images'));
});

gulp.task('sass', () => {
  gulp.src('./themes/custom/luke/sass/**/*.scss')
    .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./themes/custom/luke/css'));
});

gulp.task('js', () => {
  // app.js is your main JS file with all your module inclusions
  return browserify({entries: './themes/custom/luke/lib/app.js', debug: true})
      .transform("babelify", { presets: ["@babel/preset-env"] })
      .bundle()
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest('./themes/custom/luke/js'))
      .pipe(livereload());
});

gulp.task('default', () => {
    livereload.listen();
    gulp.watch('./themes/custom/luke/sass/**/*.scss', ['sass']);
    gulp.watch('./themes/custom/luke/lib/*.js', ['js']);
    gulp.watch(['./themes/custom/luke/css/app.css', './themes/custom/luke/**/*.twig', './themes/custom/luke/js/*.js'], function (files){
        livereload.changed(files)
    });
});