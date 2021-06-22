const path = require('path')
const fs = require('fs')
const { getAst,getDeps,getCode } = require('./parser')

class compiler{
    constructor(options = {}) {
        // webpack配置
        this.options = options
        // 所有依赖的容器
        this.modules = []
    }
    run() {
        const entryPath = path.resolve(process.cwd(),this.options.entry)
        // 递归获取所有依赖关系图
        this.getModules(entryPath)
        // 初始化关系依赖图
        const depsGraph = this.modules.reduce((graph, module) => {
          return {
              ...graph,
              [module.absolutePath]:{
                  code: module.code,
                  deps: module.deps
              }
          }
        }, {})
        this.generate(depsGraph)
    }

    // 递归获取依赖
    getModules(absolutePath) {
        const module = this.build(absolutePath)
        const { deps } = module
        this.modules.push(module)
        for(let relativePath in deps) {
            this.getModules(deps[relativePath])
        }
    }

    // 获取单模块信息
    build(absolutePath) {
        // 获取babelParser编译的ast
        // sourceType:module
        // es module类型的ast语法树
        const ast = getAst(absolutePath)
        // 获取依赖deps
        /*"deps": {
            "./add.js": "C:\\Users\\mj\\Desktop\\webpack5\\code\\webpackGenerate\\src\\add.js",
            "./count.js": "C:\\Users\\mj\\Desktop\\webpack5\\code\\webpackGenerate\\src\\count.js"
        }*/
        const deps = getDeps(ast, absolutePath)
        // 获取入口code
        const code = getCode(ast)
        return {
            absolutePath, // 绝对路径
            deps, // 依赖对象
            code // 经过babel转换字符串code
        }
    }

    // 生成代码文件
    generate(depsGraph) {
        /*
        depsGraph结构表
          {
            "C:\Users\mj\Desktop\webpack5\code\webpackGenerate\src\index.js": {
                "code": "\"use strict\";\n
                    // require函数其实是loaderRequire函数,其返回值是runCode中exports私有变量
                    \n var _add = _interopRequireDefault(require(\"./add.js\"));
                    \n\n var _count = _interopRequireDefault(require(\"./count.js\"));
                    // 判断exports是否为esModule,不是则创建对应对象
                    \n\n function _interopRequireDefault(obj) {
                        return obj && obj.__esModule ? obj : { \"default\": obj };
                    }
                    \n\n console.log((0, _add[\"default\"])(1, 2));
                    \n console.log((0, _count[\"default\"])(3, 2));",
                "deps": {
                    "./add.js": "C:\\Users\\mj\\Desktop\\webpack5\\code\\webpackGenerate\\src\\add.js",
                    "./count.js": "C:\\Users\\mj\\Desktop\\webpack5\\code\\webpackGenerate\\src\\count.js"
                }
           },
            "C:\\Users\\mj\\Desktop\\webpack5\\code\\webpackGenerate\\src\\add.js": {
                "code": "\"use strict\";\n
                    // 装载私有的exports变量,为babel类型的exports,然后续代码可用
                    \n Object.defineProperty(exports, \"__esModule\", {\n  value: true\n});
                    \n exports[\"default\"] = add;
                    \n\n function add(a, b) {\n  return a + b;\n}",
                "deps": {}
           },
            "C:\\Users\\mj\\Desktop\\webpack5\\code\\webpackGenerate\\src\\count.js": {
                "code": "\"use strict\";\n
                    // 装载私有的exports变量,为babel类型的exports,然后续代码可用
                    \n Object.defineProperty(exports, \"__esModule\", {\n  value: true\n});
                    \n exports[\"default\"] = count;
                    \n\n function count(a, b) {\n  return a - b;\n}",
                "deps": {}
            }
         }
        */
        const entryPath = path.resolve(process.cwd(),this.options.entry)
        const bundle = `(function(depsGraph) {
            function runCode(absolutePath){
                var exports = {}
                function loaderRequire(relativePath) {
                    // 找到引入模块的绝对路径
                    // depsGraph[absolutePath]包含所有依赖deps
                    // 当relativePath为add.js/count.js时,absolutePath为xxx/index.js
                    // 当relativePath为childCount.js时,absolutePath为xxx/count.js
                    return runCode(depsGraph[absolutePath].deps[relativePath])
                }
                (function (require, exports, code) {
                    // eval内代码调用require函数(loaderRequire),再去调用外层runCode
                    eval(code)
                })(loaderRequire, exports,depsGraph[absolutePath].code)
                // 返回exports, 上面的匿名函数共享exports数据
                return exports
            }
            runCode(${JSON.stringify(entryPath)})
        })(${JSON.stringify(depsGraph)})`
        const outputPath = path.resolve(this.options.output.path,this.options.output.fileName)
        fs.writeFileSync(outputPath, bundle, 'utf-8')
    }
}

module.exports = compiler
