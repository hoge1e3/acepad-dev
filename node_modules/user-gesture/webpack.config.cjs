const path=require('path');

module.exports = [
    {
        entry: './index.js',
        output: {
            library: "UserGesture",
            libraryTarget: 'umd',
            path: path.resolve(__dirname, "dist"),
            filename: 'user-gesture.js',
            globalObject: 'this',
        },
    },
];