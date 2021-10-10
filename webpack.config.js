const path = require('path');
module.exports = {
    mode: "development",
    target: 'es5',
    devtool: "source-map",
    entry: {
        main: "./src/Main.ts",
    },
    output: {
        path: path.resolve(__dirname, './Layouts/FormChangeWebPart'),
        filename: "bundle.js",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            }
        ]
    }
};