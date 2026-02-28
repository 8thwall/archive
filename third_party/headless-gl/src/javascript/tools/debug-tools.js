const isDebugMode = process.env.HEADLESS_GL_DEBUG_MODE || false
const printStackTrace = process.env.HEADLESS_GL_PRINT_STACK_TRACE || false

const printStackTraceWithArgs = (args) => {
    if(!printStackTrace)
        return

    // Replace upToLevel with the number of levels you want to print (in case you want a stack trace)
    let upToLevel = 2

    // Capture the current stack trace using Error.captureStackTrace
    const stackHolder = {}
    Error.captureStackTrace(stackHolder)

    // Split the stack trace into lines, starting from the second line to skip this function itself
    const stackLines = stackHolder.stack.split("\n").slice(1)

    // Loop through each line up to the specified level
    stackLines.slice(1, upToLevel).forEach((line, index) => {
        // Extract function name and line number from the stack trace line
        const match = line.trim().match(/at\s+(.*)\s+\(([^)]+)\)/) || line.trim().match(/at\s+(.*)/)
        if (match) {
            const funcName = match[1]
            // replace args with args.length for just the count.            
            console.log(`Level ${index + 1}: Function - ${funcName}: Arguments: `, args)
        }
    })
  }

export { isDebugMode, printStackTraceWithArgs }