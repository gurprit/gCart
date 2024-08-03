const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');

// Paths
const paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'public_html/css'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'public_html/js'
  }
};

// Compile SASS
gulp.task('sass', function() {
  return gulp.src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.styles.dest));
});

// Minify CSS
gulp.task('minify-css', gulp.series('sass', function() {
  return gulp.src(`${paths.styles.dest}/*.css`)
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.styles.dest));
}));

// Minify JavaScript
gulp.task('scripts', function() {
  return gulp.src(paths.scripts.src)
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest));
});

// Watch files for changes
gulp.task('watch', function() {
  gulp.watch(paths.styles.src, gulp.series('sass', 'minify-css'));
  gulp.watch(paths.scripts.src, gulp.series('scripts'));
});

// Default task
gulp.task('default', gulp.series('sass', 'minify-css', 'scripts', 'watch'));
