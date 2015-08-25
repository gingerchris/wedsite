var gulp    = require('gulp');
var concat  = require('gulp-concat');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var sass    = require('gulp-ruby-sass');
var todo = require('gulp-todo');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('todo',function(){
  gulp.src(['js/*.js'])
  .pipe(todo())
  .pipe(gulp.dest('./'));
});

gulp.task('sass',function(){
  return sass('sass/style.scss')
    .on('error', function (err) {
        console.error('Error!', err.message);
    })
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('./'))
    .pipe(connect.reload());
});

gulp.task('connect', function() {
  connect.server();
});

gulp.task('js', function(){
  gulp.src(['js/**/*.js','js/*.js','!js/vendor/jquery-1.11.3.min.js'])
  .pipe(sourcemaps.init())
    .pipe(concat('./script.js'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest("./"))
  .pipe(connect.reload());
});

gulp.task('watch',function(){
  gulp.watch(['js/*.js','js/**/*.js'],['js']);
  gulp.watch(['sass/*.scss',],['sass']);
});

gulp.task('default',['js', 'sass', 'connect', 'watch']);
