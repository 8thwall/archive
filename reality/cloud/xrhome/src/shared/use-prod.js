const isNode = !!(process && process.versions && process.versions.node)

let useProd
if (isNode) {
  useProd = process.env.NODE_ENV === 'production' &&
            process.env.CONSOLE_ENV !== 'dev' &&
            process.env.XRHOME_ENV !== 'Console-dev'
} else {
  useProd = !BuildIf.ALL_QA
}

module.exports = useProd
