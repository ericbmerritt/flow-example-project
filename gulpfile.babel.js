import { exec } from 'child_process';
import Babel from 'gulp-babel';
import Copy from 'gulp-copy';
import Eslint from 'gulp-eslint';
import Gulp from 'gulp';
import Log from 'fancy-log';
import Merge from 'merge-stream';
import Path from 'path';
import PluginError from 'plugin-error';
import Prettier from 'gulp-prettier';
import SourceMaps from 'gulp-sourcemaps';
import Webpack from 'webpack';
import Jest from 'gulp-jest';

const webpackConfig = {
  devtool: 'sourcemap',
  entry: {
    app: './dist/main.js'
  },
  output: {
    path: Path.join(__dirname, 'dist/site/public/js/'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['./node_modules']
            }
          }
        ]
      }
    ]
  }
};

/**
 * Gulp tasks
 */

Gulp.task('babel', function() {
  return Gulp.src('src/**/*.js')
    .pipe(SourceMaps.init())
    .pipe(Babel())
    .pipe(SourceMaps.write('.'))
    .pipe(Gulp.dest('dist'));
});

Gulp.task('lint', () => {
  return Gulp.src(['src/**/*.js', '!node_modules/**'])
    .pipe(Eslint({ fix: false }))
    .pipe(Eslint.format())
    .pipe(Eslint.failAfterError());
});

Gulp.task('fix', () => {
  return Gulp.src(['src/**/*.js', '!node_modules/**'])
    .pipe(Eslint({ fix: true }))
    .pipe(Eslint.format())
    .pipe(Eslint.failAfterError())
    .pipe(Gulp.dest('src'));
});

Gulp.task('flow', function(cb) {
  exec('flow check', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

Gulp.task('build', Gulp.series('babel', 'flow', 'lint'));

Gulp.task('test', function() {
  return Gulp.src('tests').pipe(
    Jest({
      preprocessorIgnorePatterns: [
        '<rootDir>/dist/',
        '<rootDir>/node_modules/'
      ],
      automock: false,
      reporters: [
        'default',
        ['jest-junit', { output: './test-reports/junit.xml' }]
      ],
      collectCoverage: true,
      coverageFormats: ['json', 'html']
    })
  );
});

Gulp.task(
  'webpack',
  Gulp.series('build', function(callback) {
    const myConfig = Object.assign({}, webpackConfig);
    myConfig.mode = 'development';
    // run webpack
    Webpack(myConfig, function(err, stats) {
      if (err) {
        throw new PluginError('webpack', err);
      }

      Log.info(
        '[webpack]',
        stats.toString({
          colors: true,
          progress: true
        })
      );
      callback();
    });
  })
);

Gulp.task(
  'firebase',
  Gulp.series('webpack', () => {
    const streams = [
      Gulp.src('database.rules.json').pipe(Gulp.dest('dist/site')),
      Gulp.src('firebase.json').pipe(Gulp.dest('dist/site')),
      Gulp.src('firestore.rules').pipe(Gulp.dest('dist/site')),
      Gulp.src('firestore.indexes.json').pipe(Gulp.dest('dist/site')),
      Gulp.src('storage.rules').pipe(Gulp.dest('dist/site')),
      Gulp.src('functions').pipe(Gulp.dest('dist/site')),
      Gulp.src('public/**/*').pipe(Copy('dist/site'))
    ];
    return Merge(streams);
  })
);
