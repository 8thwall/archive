const BROWSER_PROTOCOL = 'browser:'

// NOTE(johnny): This is used to create a url that will open in the browser with matching
// console server url.
const createBrowserUrl = (path: string, queryParams: Record<string, string> = {}): string => {
  const url = new URL(path, `${BROWSER_PROTOCOL}//`)
  Object.entries(queryParams).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })
  return url.toString()
}

export {
  BROWSER_PROTOCOL,
  createBrowserUrl,
}
