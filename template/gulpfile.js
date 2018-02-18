const path = require('path'),
      gulp = require('gulp'),
      // jshint = require('gulp-jshint'),
      sourcemaps = require('gulp-sourcemaps'),
      clean = require('gulp-clean'),
      pug = require('gulp-pug'),
      webpack = require('webpack'),
      WebpackDevServer = require('webpack-dev-server'),
      browserSync = require('browser-sync'),
      log = require('fancy-log'),
      PluginError = require('plugin-error'),
      webpackConfig = require('./webpack.config.js'),
      options = {
        app_dir: 'app/',
        dist_dir: 'dist/',
        script_glob: 'app/js/**/*.js',
        bundle_output_path: 'dist/js/bundle.js',
        app_pug_glob: 'app/pug/**/*.pug',
        dist_html_dir: 'dist/',
        dist_html_glob: 'dist/*.html',
        app_index_page: 'app/index.pug',
        dist_index_page: 'dist/index.html'
      },
      SERVER_PORT = <%= serverPort %>,
      SERVER_HOST = '<%= serverHost %>';

// gulp.task('jshint', () => {
//   return gulp.src(option.script_glob)
//     .pipe(jshint())
//     .pipe(jshint.reporter('default'));
// });

gulp.task('clean:html', () => {
  return gulp.src(options.dist_html_glob, {read: false,
                                           allowEmpty: true})
    .pipe(clean());
});

gulp.task('clean:index', () => {
  return gulp.src(options.dist_index_page, {read: false,
                                            allowEmpty: true})
    .pipe(clean());
});

gulp.task('clean:js', () => {
  return gulp.src(options.bundle_output_path, {read: false,
                                               allowEmpty: true})
    .pipe(clean());
});
gulp.task('clean', gulp.parallel('clean:html',
                                 'clean:js',
                                 'clean:index'));

gulp.task('bundle:pug', () => {
  return gulp.src(options.app_pug_glob)
    .pipe(pug())
    .pipe(gulp.dest(options.dist_html_dir));
});

gulp.task('bundle:index', () => {
  return gulp.src(options.app_index_page)
    .pipe(pug())
    .pipe(gulp.dest(options.dist_dir));
  
});

gulp.task('bundle:webpack', (callback) => {
  let buildConfig = Object.create(webpackConfig);

  buildConfig.plugins = buildConfig.plugins || [];
  buildConfig.plugins = buildConfig.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.UglifyJsPlugin()
  );

  webpack(buildConfig, (err, stats) => {
    if (err) {
      throw new PluginError('webpack:build', err);
    }

    log('[webpack:build]', 'Build');
    
    callback();
  });
});

gulp.task('bundle', gulp.parallel('bundle:pug',
                                  'bundle:index',
                                  'bundle:webpack'));

gulp.task('default', gulp.series('clean', 'bundle'));

gulp.task('webpack:dev', (function () {
  let devConfig = Object.create(webpackConfig);
  devConfig.devtool = 'sourcemap';
  // devConfig.debug = true;

  let devCompiler = webpack(devConfig);
  
  return (callback) => {
    devCompiler.run((err, stats) => {
      if (err) {
        throw new PluginError('webpack:build-dev', err);
      }

      log('[webpack:dev]', stats.toString({
        colors: true
      }));

      callback();
    });
  };
})());

gulp.task('browser-sync:reload', (callback) => {
  browserSync.reload();
  callback();
});

gulp.task('watch', () => {
  browserSync.init({
    server: {
      baseDir: options.dist_dir,
      port: SERVER_PORT,
      host: SERVER_HOST
    }
  });

  let jsWatcher = gulp.watch(options.script_glob,
                             gulp.series('clean:js',
                                         'bundle:webpack',
                                         'browser-sync:reload'));

  let pugWatcher = gulp.watch(options.app_pug_glob,
                              gulp.series('clean:html',
                                          'bundle:pug',
                                          'browser-sync:reload'));

  let indexPageWatcher = gulp.watch(options.app_index_page,
                                    gulp.series('clean:index',
                                                'bundle:index',
                                                'browser-sync:reload')) ;

  jsWatcher.on('change', (event) => {
    log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

  pugWatcher.on('change', (event) => {
    log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

  indexPageWatcher.on('change', (event) => {
    log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});
