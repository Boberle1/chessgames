const path = require("path");
module.exports = {
    mode: "production",
    entry: "./public/Index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname + "/public", "dist")
    }
}