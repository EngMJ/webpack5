const copyWebpack = require('./copyWebpack.js')
module.exports = {
    mode: 'development',
    plugins: [
        new copyWebpack({
            from: 'public',
            to: 'css',
            ignore: ['index.html']
        })
    ]
}
