const path = require('path');

module.exports = {
  // Entry point (adjust if needed)
  entry: './src/index.jsx',

  // Output (adjust output path/name as needed)
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,        // Transpile both .js and .jsx files
        exclude: /node_modules/,    // Exclude dependencies
        use: {
          loader: 'babel-loader',
          options: {
            // Babel options here or use .babelrc
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      // You can add other loaders here (e.g. css-loader, file-loader)
    ],
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx', '.json'], // Resolve these extensions
  },

  // Optional: devServer config if you use webpack-dev-server
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 3000,
    open: true,
    hot: true,
  },
};
