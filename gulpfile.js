//import everything
var g               = require('gulp');
var sass            = require('gulp-sass');
var cleanCss        = require('gulp-clean-css');
var prefix          = require('gulp-autoprefixer');
var uglify          = require('gulp-uglify');
var concat          = require('gulp-concat');
var htmlmin         = require('gulp-htmlmin');
var imgmin          = require('gulp-imagemin');
var watch           = require('gulp-watch');
var plumber         = require('gulp-plumber');
var removeComm      = require('gulp-remove-html-comments');
var clean           = require('gulp-clean');
var httpProxy       = require('http-proxy');
var browserSync     = require('browser-sync');
var connect         = require('gulp-connect-php');

//delete dist folder
g.task('clean', function () {
    return g.src('dist', {read: false})
        .pipe(clean());
});

//remove comments from php and html documents
g.task('removeComm', function () {
    return g.src(['app/**/*.php','app/**/*.html'])
        .pipe(plumber())
        .pipe(removeComm())
        .pipe(g.dest('dist/'));
});

//minify html and php files
g.task('minify', ['removeComm'] , function(){
    return g.src(['app/**/*.php' ,'app/**/*.html'])
        .pipe(plumber())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(g.dest('dist'));
});

//convert scss to css and add prefixes
g.task('compile-sass', function () {
    return g.src('app/_scss/app.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(g.dest('app/css'));
});

g.task('prefix', ['compile-sass'], function () {
    return g.src('app/css/app.css')
        .pipe(prefix({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(g.dest('app/css/'));
});

//minify css files and run the sass function before
g.task('css-build', ['prefix'], function() {
    return g.src('app/css/*.css')
        .pipe(plumber())
        .pipe(cleanCss({compatibility: 'ie8'}))
        .pipe(g.dest('dist/css'));
});

//creating app.js from all js files in the app folder
g.task('concat-js-app' ,function () {
    return g.src('app/js/app/*.js')
        .pipe(plumber())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(g.dest('app/js'))
});

//create imports.js from all js files in import folder
g.task('concat-js-third-party' ,function () {
    return g.src('app/js/third_party/*.js')
        .pipe(plumber())
        .pipe(concat('third_party.js'))
        .pipe(uglify())
        .pipe(g.dest('app/js'))
});

//uglify all flies
g.task('js-build', ['concat-js-app','concat-js-third-party'] , function () {
    return g.src('app/js/*.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(g.dest('dist/js'))
});

//copy .htaccess files to dist folder
g.task('copy', function() {
    return g.src(['app/.htaccess', 'app/robots.txt'])
        .pipe(plumber())
        .pipe(g.dest('dist'));
});

//compress all images from app folder
g.task('imgmin', function () {
    return g.src('app/img/**/*')
        .pipe(plumber())
        .pipe(imgmin())
        .pipe(g.dest('dist/img'));
});

// watch for file changes and performs the different tasks
g.task('dev-watch', function () {
    g.watch('app/js/**/*.js',         ['concat-js-app','concat-js-third-party']);
    g.watch('app/_scss/**/*',         ['prefix']);
});

//connect to a php server and live update when changes are made
g.task('connect-php', function () {
    connect.server({
        port: 8078,
        base: 'app',
        open: false
    });

    var proxy   = httpProxy.createProxyServer({});
    var reload  = browserSync.reload;

    browserSync({
        notify: false,
        port  : 8078,
        server: {
            baseDir   : ['app'],
            middleware: function (req, res, next) {
                var url = req.url;

                if (!url.match(/^\/(css)\//)) {
                    proxy.web(req, res, { target: 'http://localhost:8078' });
                } else {
                    next();
                }
            }
        }
    });

    g.watch([
        'app/**/*.html',
        'app/**/*.php',
        'app/js/*.js',
        'app/img/**/*',
        'app/css/app.css'
    ]).on('change', reload);

    g.watch('app/_scss/**/*scss',       ['compile-sass']);
    g.watch('app/js/app/*.js',         ['concat-js-app']);
    g.watch('app/js/third_party/*.js', ['concat-js-third-party']);
});

//clean old dist and compile all files
g.task('build',['clean'],function () {
    g.start('minify', 'css-build', 'js-build', 'copy', 'imgmin')
});

//developing with xampp
g.task('dev',       ['prefix', 'concat-js-third-party', 'concat-js-app', 'dev-watch']);

//run css tole to compile css
g.task('default',   ['prefix', 'concat-js-third-party', 'concat-js-app' ,'connect-php']);