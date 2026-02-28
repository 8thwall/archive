// @attr(target = "node")
// @attr(esnext = 1)
// @visibility(//visibility:public)

// @dep(//bzl/js:fetch)

const {fetch} = globalThis as any

// eslint-disable-next-line max-len
const passcodeUrl = 'https://<REMOVED_BEFORE_OPEN_SOURCING>.execute-api.us-west-2.amazonaws.com/prod/challenge'
async function getStagingCookie(passcode: string, url: string): Promise<string> {
  if (!passcode) {
    throw new Error('Please provide a passcode to load the 8th Wall staging URL')
  }

  let cookie = ''

  const result = await fetch(passcodeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access: passcode,
      url,
    }),
  })

  const data = result.ok ? await result.json() : {}
  if (!data.token) {
    throw new Error('Unauthorized! Please check the passcode')
  }
  cookie = data.token

  return cookie
}

export {getStagingCookie}
