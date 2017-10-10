const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tsconfig = require('./tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');

// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del('dist/**/*');
});


// check the code for explicitly typed variables
// TODO Error running the tslint task!!!!!
gulp.task('tslint', ['clean'], function () {
  return gulp
    .src('app/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});


// typescript compile
gulp.task('compile', ['clean'], function () {
  return gulp
      .src('app/**/*.ts')
      .pipe(sourcemaps.init())        // sourcemaps
      .pipe(typescript(tsconfig.compilerOptions))
      .pipe(gulp.dest('dist'));
});


// copy dependencies
gulp.task('copy:libs', ['clean'], function () {
  return gulp
    .src([
        'node_modules/es6-shim/es6-shim.min.js',
        'node_modules/systemjs/dist/system-polyfills.js',
        'node_modules/@angular/es6/dev/src/testing/shims_for_IE.js',
        'node_modules/systemjs/dist/system.src.js',
        'node_modules/systemjs/dist/system.js',
        'node_modules/typescript/lib/typescript.js',
        'node_modules/rxjs/bundles/Rx.js',
        'node_modules/@angular/bundles/@angular.js',
        'node_modules/@angular/bundles/http.js',
        'node_modules/@angular/bundles/router.js',
        'node_modules/reflect-metadata/Reflect.js',
        'node_modules/zone.js/dist/zone.js',
        'node_modules/ng2-bootstrap/bundles/ng2-bootstrap.js',
        'node_modules/ng2-pagination/dist/ng2-pagination-bundle.js',
        'node_modules/ng2-table/ng2-table.js',
        'node_modules/ng2-idle/budles/ng2-idle.js',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/moment/moment.js'
    ])
  .pipe(gulp.dest('dist/lib'))
});

// copy index.html
gulp.task('copy:index', ['clean'], function () {
  return gulp
    .src('index.html', 'systemjs.config.js')
    .pipe(gulp.dest('dist'))
});


// copy all statics css
gulp.task('copy:assets', ['clean'], function () {
  return gulp
      .src(['assets/**/*'])
      .pipe(gulp.dest('dist/assets'))
});


// copy the statics html
gulp.task('copy:html', ['clean'], function () {
  return gulp
      .src(['app/**/*.html'])
      .pipe(gulp.dest('dist/app'))
});


// copy modules
gulp.task('copy:modules', ['clean'], function () {
  return gulp
    .src(['node_modules/ng2-table/**/*.js', '!node_modules/ng2-table/gulpfile.js'])
    .pipe(gulp.dest('dist/lib/ng2-table'));
})


// copy modules
gulp.task('copy:ng2-file-upload', ['clean'], function () {
  return gulp
    .src(['node_modules/ng2-file-upload/**/*.js', '!node_modules/ng2-file-upload/gulpfile.js'])
    .pipe(gulp.dest('dist/lib/ng2-file-upload'));
})

// copy modules
gulp.task('copy:ng2-idle', ['clean'], function () {
  return gulp
    .src(['node_modules/ng2-idle/**/*.js'])
    .pipe(gulp.dest('dist/lib/ng2-idle'));
})



gulp.task('build', ['compile', 'copy:libs', 'copy:html', 'copy:index',
                            'copy:assets', 'copy:modules', 'copy:ng2-file-upload',
                            'copy:ng2-idle']);
gulp.task('default', ['build']);
