// gulpfile.js

//DEPENDENCIES

  var gulp = require('gulp');
  var sass = require('gulp-sass');
  var inject = require('gulp-inject');
  var browserSync = require('browser-sync').create();
  var htmlclean = require('gulp-htmlclean');
  var cleanCSS = require('gulp-clean-css');
  var concat = require('gulp-concat');
  var uglify = require('gulp-uglify');
  var del = require('del');




//PATHS

  var paths = {
    src: 'src/**/*',
    srcHTML: 'src/**/*.html',
    srcCSS: 'src/**/*.css',
    srcJS: 'src/**/*.js',
    
    tmp: 'tmp',
    tmpIndex: 'tmp/index.html',
    tmpCSS: 'tmp/**/*.css',
    tmpJS: 'tmp/**/*.js',
    
    dist: 'dist',
    distIndex: 'dist/index.html',
    distCSS: 'dist/**/*.css',
    distJS: 'dist/**/*.js'
  };


//COPY HTML/CSS/JS

  gulp.task('html', function () {
    return gulp.src(paths.srcHTML).pipe(gulp.dest(paths.tmp));
  });
  gulp.task('css', function () {
    return gulp.src(paths.srcCSS).pipe(gulp.dest(paths.tmp));
  });
  gulp.task('js', function () {
    return gulp.src(paths.srcJS).pipe(gulp.dest(paths.tmp));
  });
  gulp.task('copy', ['html', 'css', 'js']);


//INJECT

  gulp.task('inject', ['copy'], function () {
    var css = gulp.src(paths.tmpCSS);
    var js = gulp.src(paths.tmpJS);
    return gulp.src(paths.tmpIndex)
      .pipe(inject( css, { relative:true } ))
      .pipe(inject( js, { relative:true } ))
      .pipe(gulp.dest(paths.tmp));
  });



//SERVE/SYNC/SASS

  // Compile sass into CSS & auto-inject into browsers
   
    gulp.task('sass', function() {
        return gulp.src("src/style.scss")
            .pipe(sass())
            .pipe(gulp.dest("tmp"))
            .pipe(browserSync.stream());
    });

  //SERVER, BROWSER-SYNC  

    gulp.task('serve', ['sass'], function() {

        browserSync.init({
            server: "./tmp"
        });

        gulp.watch("./src/style.scss", ['sass', 'inject']);
        gulp.watch('./src/**/*.html', ['inject']);
        gulp.watch(".tmp/*.css").on("change", browserSync.reload);
        gulp.watch("./tmp/*.html").on('change', browserSync.reload);
    });


    gulp.task('default', ['serve']);


//GULP BUILD

  gulp.task('html:dist', function () {
    return gulp.src(paths.srcHTML)
      .pipe(htmlclean())
      .pipe(gulp.dest(paths.dist));
  });
  gulp.task('css:dist', function () {
    return gulp.src(paths.srcCSS)
      .pipe(concat('style.min.css'))
      .pipe(cleanCSS())
      .pipe(gulp.dest(paths.dist));
  });
  gulp.task('js:dist', function () {
    return gulp.src(paths.srcJS)
      .pipe(concat('script.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest(paths.dist));
  });
  gulp.task('copy:dist', ['html:dist', 'css:dist', 'js:dist']);
  gulp.task('inject:dist', ['copy:dist'], function () {
    var css = gulp.src(paths.distCSS);
    var js = gulp.src(paths.distJS);
    return gulp.src(paths.distIndex)
      .pipe(inject( css, { relative:true } ))
      .pipe(inject( js, { relative:true } ))
      .pipe(gulp.dest(paths.dist));
  });

  gulp.task('build', ['inject:dist']);

// CLEANUP

  gulp.task('clean', function () {
    del([paths.tmp, paths.dist]);
  });
