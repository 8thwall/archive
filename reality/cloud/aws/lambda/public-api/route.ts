const branch = (branchMap) => {
  let paramName
  let wildcardKey
  // Wildcard keys look like "{paramName}".
  const wildcardKeys = Object.keys(branchMap).map(e => e.match(/^{(.*)}$/)).filter(Boolean)
  if (wildcardKeys.length === 1) {
    [[wildcardKey, paramName]] = wildcardKeys
  } else if (wildcardKeys.length > 1) {
    throw new Error(`Multiple wildcard keys cannot be specified: ${wildcardKeys.join(', ')}`)
  }
  return (path, method, pathParams) => {
    const pathMatch = path.match(/^\/?([^/]*)(.*)$/)

    const [, pathPart, remainingPath] = pathMatch

    if (branchMap[pathPart]) {
      return branchMap[pathPart](remainingPath, method, pathParams)
    } else if (paramName) {
      pathParams[paramName] = pathPart
      return branchMap[wildcardKey](remainingPath, method, pathParams)
    } else {
      return null
    }
  }
}

const methods = methodMap => (path, method) => (path === '' && methodMap[method]) || null

export {
  branch,
  methods,
}
