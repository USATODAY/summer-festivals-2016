var path            = require('path');
var paths           = require('./');
var webpack         = require('webpack');
var webpackManifest = require('../lib/webpackManifest');

module.exports = function(env) {
  var jsSrc = path.resolve(paths.sourceDirectory + '/js/');
  var jsDest = paths.publicDirectory + '/js/';
  var publicPath = 'js/';

  var webpackConfig = {
    context: jsSrc,

    plugins: [],

    resolve: {
      alias: {
        'eventEmitter/EventEmitter': 'wolfy87-eventemitter/EventEmitter',
        'get-style-property/get-style-property': 'desandro-get-style-property/get-style-property',
        'matches-selector/matches-selector': 'desandro-matches-selector/matches-selector',
        'classie/classie': 'desandro-classie/classie'
      },
      extensions: ['', '.js']
    },

    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader?stage=1',
          exclude: /node_modules/
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
          exclude: /node_modules/
        },
        {
          test: /\.yml/,
          loader: 'json-loader!yaml-loader',
          exclude: /node_modules/
        },
        {
          test: /\.tmpl\.html/,
          loader: 'ejs-loader'
        },
        {
          test: /\.css/,
          loader: 'style-loader!css-loader'
        },
        {
          test: /isotope-layout/,
          loader: 'imports?define=>false&this=>window'
        }
      ]
    }
  };

  webpackConfig.plugins.push(
    new webpack.ProvidePlugin({
        _:"lodash"
    })
  );

  if (env !== 'test') {
    webpackConfig.entry = {
      main: ['./main.js']
    };

    webpackConfig.output = {
      path: jsDest,
      // filename: env === 'production' ? '[name]-[hash].js' : '[name].js',
      filename: '[name].js',
      publicPath: publicPath
    };
  }

  if (env === 'development') {
    webpackConfig.devtool = 'source-map';
    webpack.debug = true;
  }

  if (env === 'production') {
    webpackConfig.plugins.push(
      new webpackManifest(publicPath, 'public'),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.NoErrorsPlugin()
    );
  }

  return webpackConfig;
};
