var path = require('path');

module.exports = {
    entry: ['./scripts/main.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]_bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                     'css-loader'
                ]

            }


        ]

    },


}