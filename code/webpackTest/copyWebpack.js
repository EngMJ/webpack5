const fs = require('fs')
const path = require('path')
const globby = require('globby')
const { promisify } = require('util')
const { validate } = require('schema-utils')
const json = require('./schema.json')
const { sources } = require('webpack')
const { RawSource } = sources
const readFile = promisify(fs.readFile)
module.exports = class copyWebpack{
    constructor(options = {}) {
        // 校验opations
        validate(json,options, {
            name: 'options'
        })
        this.options = options
    }
    apply(compiler) {
        compiler.hooks.thisCompilation.tap('compilation', (compilation) => {
            compilation.hooks.additionalAssets.tapAsync('assets',async (cb) => {
                const { ignore,from } = this.options
                // 判断to内容
                const to = this.options.to || '.'
                // 转换from为绝对路径
                // compiler.options.context == process.cwd()
                const absoluteFrom = path.isAbsolute(from) ? from : path.resolve(compiler.options.context, from)
                // 忽略文件,读取文件列表
                // 不能用 const absolutePath = await globby(absoluteFrom, { ignore })
                const filePath = fs.readdirSync(absoluteFrom)
                const absolutePath = filePath.reduce((arr,pathItem) => {
                    if(!ignore.includes(pathItem)) {
                        arr.push(path.resolve(absoluteFrom,pathItem))
                    }
                    return arr
                }, [])
                // 读取文件
                const fileList = await Promise.all(absolutePath.map(async(absPath) => {
                    const data = await readFile(absPath)
                    // 转换为webpack source
                    const source = new RawSource(data)
                    const fileName = path.basename(absPath)
                  return {
                      source,
                      fileName
                  }
                }))
                // 输出到compiltion
                fileList.forEach(({ fileName, source }) => {
                    const outputPath = path.join(to,fileName)
                    // compilation.assets[outputPath] = source
                    compilation.emitAsset(outputPath, source);
                })
                // 结束
                cb()
            })
        })
    }
}
