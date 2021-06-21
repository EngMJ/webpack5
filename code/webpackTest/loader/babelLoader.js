const { getOptions } = require('loader-utils')
const { validate } = require('schema-utils')
const json = require('../babelschema.json')
const babel = require('@babel/core')
const { promisify } = require('util')
const transform = promisify(babel.transform)
module.exports = function(code, map, meta) {
    const options = getOptions(this) || {}
    validate(json,options,{
        name: 'babel-loader'
    })
    const cb = this.async()
    // 转化代码
    transform(code, options).then(({ code, map }) => cb(null, code,map, meta)).catch((e) => cb(e))
}
