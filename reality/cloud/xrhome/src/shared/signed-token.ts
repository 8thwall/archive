import {sign as signJwt, verify as verifyJwt} from 'jsonwebtoken'

import {KeyManager} from '../server/integration/key-manager/key-manager-api'

const DEFAULT_ISSUER = '<REMOVED_BEFORE_OPEN_SOURCING>' as const

type TokenDefinition = {
  subject: string
  expiresIn: string | number
  issuer?: string
}

type TokenMetadata = {
  iat: number
  exp: number
  iss: string
  sub: string
}

// eslint-disable-next-line arrow-parens
const defineSignedToken = <DATA extends {}>({
  subject, expiresIn, issuer = DEFAULT_ISSUER,
}: TokenDefinition) => {
  const sign = async (payload: DATA) => {
    const key = await KeyManager.use().getSigningKey()
    return signJwt(payload, key.pem, {
      issuer,
      subject,
      expiresIn,
      keyid: key.kid,
      algorithm: 'RS256',
    })
  }

  const verify = async (token: string): Promise<DATA & TokenMetadata> => (
    new Promise((resolve, reject) => verifyJwt(token, async (header, cb) => {
      try {
        if (!header.kid) {
          cb(new Error(`kid not present on header for token: ${token}`))
          return
        }
        cb(null, await KeyManager.use().getDecodingKey(header.kid))
      } catch (err) {
        cb(err)
      }
    }, {issuer, subject, algorithms: ['RS256']}, (err, res) => {
      if (err) {
        reject(err)
        return
      }
      if (typeof res === 'string') {
        reject(new Error('Unexpected JWT format'))
      } else {
        resolve(res as DATA & TokenMetadata)
      }
    }))
  )

  return {
    sign,
    verify,
  }
}

export {
  defineSignedToken,
}

export type {
  TokenMetadata,
}
