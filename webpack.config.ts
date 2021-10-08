import * as path from "path";
import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";

const config: webpack.Configuration = {
  entry: ["./src/index.ts"],
  output: {
    //path: path.join(__dirname, "./build/"),
    //filename: "[name].[hash].js",
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
  },
  mode: "development",
  target: "web",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: path.resolve(__dirname, "./node_modules/"),
      },
      {
        test: /\.(jpe?g|png|gif|svg|tga|glb|babylon|mtl|pcb|pcd|prwm|obj|mat|mp3|ogg)$/i,
        use: "file-loader",
        exclude: path.resolve(__dirname, "./node_modules/"),
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(glsl|vert|frag)?$/,
        use: "webpack-glsl-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ title: "FantasyCitySimulator" })],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};

export default config;
