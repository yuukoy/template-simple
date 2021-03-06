module.exports = {
  entry: './<%= pathApp %>/script/script.js',
  output: {
    filename: './static/script/script.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
  ]
  }
};
