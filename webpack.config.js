const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

// Check if the public directory exists
const publicDirExists = fs.existsSync(path.resolve(__dirname, 'public'));

module.exports = {
  entry: {
    popup: './src/popup.tsx',
    background: './src/background.ts',
    contentScript: './src/contentScript.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/manifest.json", to: "manifest.json" },
        { from: "src/assets", to: "assets" }
      ],
    }),
    new HtmlWebpackPlugin({
      template: publicDirExists ? './public/popup.html' : './src/popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
  ],
};