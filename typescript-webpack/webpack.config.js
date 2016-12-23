var webpack = require('webpack');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: __dirname + '/dist/js',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      {test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/},
      {test: /\.css$/, loader: 'style!css!autoprefixer?{browsers:["last 2 version", "> 1%"]}', exclude: /node_modules/}
    ]
  },
  watch: true
}