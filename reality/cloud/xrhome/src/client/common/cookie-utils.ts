function getDocumentCookies() {
  return document.cookie.split('; ').reduce((acc, currentValue) => {
    const [key, value] = currentValue.split('=')
    acc[key] = value
    return acc
  }, {})
}

function getCookie(name: string): string | null {
  const keyWithEquals = `${name}=`
  const cookie = document.cookie
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith(keyWithEquals))
    ?.substring(keyWithEquals.length)

  return cookie ? decodeURIComponent(cookie) : null
}

function setCookie(name: string, value: string) {
  const encodedVal = encodeURIComponent(value)
  document.cookie = `${name}=${encodedVal}`
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 18 Dec 2013 12:00:00 UTC`  // A past date
}

export {
  getDocumentCookies,
  getCookie,
  setCookie,
  deleteCookie,
}
