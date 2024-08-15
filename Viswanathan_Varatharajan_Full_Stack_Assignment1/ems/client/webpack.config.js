const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { createProxyMiddleware } = require('http-proxy-middleware');

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.use(
        '/graphql',
        createProxyMiddleware({
          target: 'http://localhost:3001',
          changeOrigin: true,
          pathRewrite: { '^/graphql': '' },
        })
      );
      return middlewares;
    },
    historyApiFallback: true,
    open: true,
    port: 3003,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'simple wb example',
      template: 'template_index.html',
      filename: './index.html',
    }),
  ],
  mode: 'development',
};

module.exports = () => config;
