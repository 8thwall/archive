// Helpers for routing.
//   path: resolves a location plus a relative path into a new absolute location pathname.
//   appBase: determines the base for routing within an 8th Wall hosted project.

// Utility method for constructing absolute paths from a location and a relative path.
const path = ({pathname}, rel: string) => {
  const full = `${pathname}/${rel}`
  const pathComponents =
    full.split('/').filter(pathComponent => pathComponent && pathComponent !== '.')
  const pathComponentStack = []
  pathComponents.forEach((pathComponent) => {
    if (pathComponent === '..') {
      if (!pathComponentStack.length) {
        throw new Error(`Invalid path ${rel} relative to ${pathname}`)
      }
      pathComponentStack.pop()
      return
    }
    pathComponentStack.push(pathComponent)
  })
  return `/${pathComponentStack.join('/')}`
}

// Get the base URL for this cloud editor project. This will typically be /[project-name], unless
// certain connected domain configurations are used, in which case it might be ''.
const appBase = () => {
  const project : any = document.querySelector('meta[name="8thwall:project"]') || {content: ''}
  const projectPath = `/${project.content}`
  return location.pathname.startsWith(projectPath) ? projectPath : ''
}

export {path, appBase}
