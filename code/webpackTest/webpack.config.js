const copyWebpack = require('./copyWebpack.js')
const path = require('path')
module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babelLoader',
                options: {
                    presets: [
                        '@babel/preset-env'
                    ]
                }
            }
        ]
    },
    plugins: [
        new copyWebpack({
            from: 'public',
            to: 'css',
            ignore: ['index.html']
        })
    ],
    // 配置loader解析规则
    resolveLoader: {
        modules: ['node_modules', path.resolve(__dirname, 'loader')]
    }
}
