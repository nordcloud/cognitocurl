module.exports = {
  entry: "./src/index.js",
  output: {
    path: __dirname + "/dist",
    publicPath: "/",
    filename: "cognitohosteduilauncher.js"
  },
  devServer: {
    contentBase: "./dist",
    port: 3000
  }
};
