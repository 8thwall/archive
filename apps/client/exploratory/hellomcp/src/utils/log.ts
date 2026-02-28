const DEBUG = process.env.DEBUG === '1' || process.env.DEBUG === 'true'

const log = (...args: any[]) => {
  if (!DEBUG) {
    return
  }
  const formattedArgs = args
    .map(e => (typeof e === 'object' ? JSON.stringify(e, null, 2) : e))
    .join(' ')
  const msg = `[DEBUG ${new Date().toISOString()}] ${formattedArgs}\n`
  // MCP attempts to JSON serialize anything written to stdout.
  process.stderr.write(msg)
}

export {
  log,
}
