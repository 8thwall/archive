type RequestInit = Parameters<typeof fetch>[1]

/* eslint-disable arrow-parens */
const fetchJson = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const result = await fetch(url, options)
  if (!result.ok) {
    throw new Error(`Failed to fetch ${url}: ${result.statusText}`)
  }
  return result.json()
}

export {
  fetchJson,
}
