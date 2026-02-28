// @visibility(//visibility:public)

const getJsonResultFromLog = (logSplit: string[], key: string) => {
  const endDelimiter = '/end/'
  const line = logSplit.find(str => str.includes(key))
  if (!line) {
    throw new Error(`[parse-log] Could not find key ${key} in logSplit`)
  }
  const lineWithoutPrefix = line?.slice(line.indexOf('/end/') + endDelimiter.length)
  return JSON.parse(lineWithoutPrefix)
}

export {getJsonResultFromLog}
