// @attr(target = "node")
// @attr(esnext = 1)
// @visibility(//visibility:public)

// @dep(//bzl/js:fetch)

import {existsSync, promises as fs} from 'fs'
import path from 'path'
import crypto from 'crypto'

import {parseHostingDomain} from '@nia/reality/cloud/aws/edge-lambda/shared/parse-hosting-domain'

const {fetch} = globalThis as any
const devTokenUrl = 'https://www.dev.8thwall.app/token/'

const encryptionKey = crypto.createHash('sha256').update(devTokenUrl).digest()

const getExpirationDate = (cookie: string): string => {
  const expiresMatch = cookie.match(/Expires=([^;]+)/)  // Stop matching at the first semicolon
  const expires = expiresMatch ? expiresMatch[1] : null
  if (!expires) {
    throw new Error('Unable to extract expiration date from the cookie')
  }
  return expires
}

// TODO(lreyna): Move this to generic encryption/decryption methods for NAE
const encrypt = (text: string): string => {
  // refresh iv on each encryption
  const iv = crypto.randomBytes(12)  // GCM standard IV size is 12 bytes
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv)

  const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
  const authTag = cipher.getAuthTag().toString('hex')

  // Add IV and authTag for use in decryption
  return `${iv.toString('hex')}:${encrypted}:${authTag}`
}

const decrypt = (encryptedText: string): string => {
  const textParts = encryptedText.split(':')  // Split the IV, ciphertext, and authTag
  const iv = Buffer.from(textParts[0], 'hex')
  const encrypted = textParts[1]
  const authTag = Buffer.from(textParts[2], 'hex')

  const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey, iv)
  decipher.setAuthTag(authTag)

  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8')
}

const getCachedTokenData =
  async (tokenFilePath: string, workspace: string): Promise<string | null> => {
    // First time flow. File wont exist
    if (!existsSync(tokenFilePath)) {
      return null
    }

    // Read the file and decrypt the data
    let cachedTokenData
    try {
      const encryptedData = await fs.readFile(tokenFilePath, 'utf-8')
      // Decrypt data
      const decryptedData = decrypt(encryptedData)
      cachedTokenData = JSON.parse(decryptedData)
    } catch (error) {
      // in case of a parsing error, delete the file and get the token again
      await fs.unlink(tokenFilePath)
      return null
    }

    const {
      workspace: cachedWorkspace,
      token: cachedToken,
      expires: cachedExpires,
    } = cachedTokenData

    const isCachedTokenValid = workspace === cachedWorkspace &&
                               new Date(cachedExpires).getTime() >= Date.now()
    if (!isCachedTokenValid) {
      await fs.unlink(tokenFilePath)
      return null
    }

    return cachedToken
  }

const storeEncryptedToken = async (cookie: any, workspace: string, tokenFilePath: string) => {
  const expires = getExpirationDate(cookie)
  const tokenData = {
    workspace,
    token: cookie,
    expires,
  }
  const jsonStr = JSON.stringify(tokenData)
  const encryptedTokenData = encrypt(jsonStr)
  await fs.writeFile(tokenFilePath, encryptedTokenData, 'utf-8')
}

const fetchToken = async (tokenId: string) => {
  const urlToUse = devTokenUrl + tokenId.trim()
  const requestOptions = {
    method: 'GET',
    headers: {
      'user-agent': 'native-browse',
    },
    redirect: 'manual',  // Don't automatically follow redirects
  }
  const response = await fetch(urlToUse, requestOptions)
  if (response.status !== 302 || !response.headers.get('Set-Cookie')) {
    throw new Error(`Getting access failed with status: ${response.status}`)
  }

  return response.headers.get('Set-Cookie')
}

const getDevCookie =
  async (tokenId: string, url: string, directoryPath: string): Promise<string> => {
    const targetUrl = new URL(url)
    const {workspace} = parseHostingDomain(targetUrl.host)!
    const appName = targetUrl.pathname.split('/')[1]
    const tokenFilePath = path.join(directoryPath, 'devtoken')
    // Prioritize tokenId over cached token data
    if (tokenId && tokenId.length === 6) {
      try {
        const cookie = await fetchToken(tokenId)
        await storeEncryptedToken(cookie, workspace, tokenFilePath)
        return cookie
      } catch (error) {
        // in case of an error, log it and try to get the token from cache
        // eslint-disable-next-line no-console
        console.log('Error fetching token', error)
      }
    }

    // Else check for cached token data
    const cachedToken = await getCachedTokenData(tokenFilePath, workspace)
    if (cachedToken) {
      return cachedToken
    }

    // error out if no tokenId is provided and no cached token data is found
    throw new Error(`Please provide a valid tokenId to load the 8th Wall dev URL
      by clicking on the "Device Authorization" button for
      https://www-cd.8thwall.com/${workspace}/${appName}/project \n`)
  }

export {
  getDevCookie,
  fetchToken,
  encrypt,
  decrypt,
}
