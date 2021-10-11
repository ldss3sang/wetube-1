const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
    entry: "./src/client/js/main.js",   // entry 우리가 변경하고자 하는 파일
    plugins: [new MiniCssExtractPlugin({
        filename: "css/styles.css"      // css 폴더 안에 styles.css를 넣겠다는 의미
    })],
    watch: true,
    mode: "development",
    output: {
        filename: "js/main.js",     // js 폴더 안의 main.js를 넣겠다는 의미
        path: path.resolve(__dirname, "assets"),    // 작업, 변환이 끝난 후 그 파일을 저장하라고 지정하는 디렉토리
        clean: true,
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [["@babel/preset-env", { targets: "defaults" }]],
              },
            },
          },
          {
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],     // webpack은 뒤에서부터 시작하기 때문에 가장 마지막에 실행될 도구를 맨 앞에 위치
          },
        ],
      },
}