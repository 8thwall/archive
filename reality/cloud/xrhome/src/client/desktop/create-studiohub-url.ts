// NOTE(johnny): This is used to create a url that will open in the studio hub app.
const createStudioHubUrl = (
  path: string, queryParams: Record<string, string> = {}
): string => {
  if (BuildIf.ALL_QA && !path.startsWith('/')) {
    throw new Error(
      `[createStudioHubUrl] Path "${path}" does not start with a leading slash.`
    )
  }
  const url = new URL(`${window.electron.studiohubProtocol}//${path}`)
  Object.entries(queryParams).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })
  return url.toString()
}

export {
  createStudioHubUrl,
}
