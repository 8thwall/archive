// @rule(js_binary)
// @attr(target = "node")
// @attr(esnext = 1)
// @attr(export_library = 1)
// @attr(mangle = 0)
// @package(npm-rendering)
// @attr(externalsType = "module")
// @attr(visibility = ["//visibility:public"])

import {WebAssembly} from '@nia/c8/dom/web-assembly'

global.WebAssembly = WebAssembly
