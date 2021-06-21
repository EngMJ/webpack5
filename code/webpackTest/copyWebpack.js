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
    // 钩子都继承扩展于Tapable库
    apply(compiler) {
        // compilation完成初始化,为syncHooks
        // (记忆内容: syncBailHooks ,该钩子的tap事件中有任意函数有return则不再继续往下执行)
        // 只可使用tap
        compiler.hooks.thisCompilation.tap('compilation', (compilation) => {
            // additionalAssets文件输出前,为 AsyncSeriesHook 异步串行钩子(类似同步运行效果)
            // AsyncParallelHook 异步并行钩子
            // 可以使用tap/tapAsync/tapPromise
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
