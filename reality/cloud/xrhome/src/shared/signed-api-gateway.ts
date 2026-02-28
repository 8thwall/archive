import {request, RequestOptions} from 'https'
import type {IncomingHttpHeaders} from 'http'
import aws4 from 'aws4'
import AWS from 'aws-sdk'

type SigningCredentials = {
  accessKeyId: string
  secretAccessKey: string
  sessionToken?: string  // NOTE(christoph): Required for a temporary key, such as from an IAM role
  region?: string
}

type CredentialParam = SigningCredentials | (() => Promise<SigningCredentials> | SigningCredentials)

type FetchOptions = {
  path: string
  method: string
  headers?: RequestOptions['headers']
  body?: any
}

type TextFetchResult = {
  statusCode: number
  headers: IncomingHttpHeaders
  data: string
}

type JsonFetchResult<T extends any> = {
  statusCode: number
  headers: IncomingHttpHeaders
  data: T
}

type FetchResult<T extends any> = TextFetchResult | JsonFetchResult<T>

const createSignedApiGateway = (
  gatewayUrl: string, credentials: CredentialParam, pathPrefix = ''
) => {
  const resolveCredentials = () => {
    if (typeof credentials === 'function') {
      return credentials()
    } else {
      return credentials
    }
  }

  /**
   * Starts a fetch-like promise to the specified API Gateway URL.
   */
  // eslint-disable-next-line arrow-parens
  const fetchText = async ({path = '', method, headers, body = null}: FetchOptions) => {
    const options: RequestOptions & {body?: string | Buffer} = {
      host: gatewayUrl,
      path: `${pathPrefix}${path}`,
      method,
      headers,
    }

    if (body) {
      if (Buffer.isBuffer(body)) {
        options.body = body
      } else {
        options.body = JSON.stringify(body)
      }
    }

    const signedOptions = aws4.sign(options, await resolveCredentials())

    return new Promise<TextFetchResult>((resolve, reject) => {
      request(signedOptions, (res) => {
        const dataParts: (string | Buffer)[] = []

        res.on('data', d => dataParts.push(d))

        res.on('end', () => {
          resolve({
            statusCode: res.statusCode!,
            headers: res.headers,
            data: dataParts.join(''),
          })
        })
      })
        .on('error', reject)
        .end(signedOptions.body || '')
    })
  }

  // eslint-disable-next-line arrow-parens
  const fetch = async <T>(options: FetchOptions): Promise<FetchResult<T>> => {
    const result = await fetchText(options)
    try {
      const data = JSON.parse(result.data) as T
      return {
        ...result,
        data,
      }
    } catch (err) {
      return result
    }
  }

  // eslint-disable-next-line arrow-parens
  const fetchJson = async <T>(options: FetchOptions): Promise<JsonFetchResult<T>> => {
    const result = await fetchText(options)
    try {
      const data = JSON.parse(result.data) as T
      return {
        ...result,
        data,
      }
    } catch (err) {
      throw new Error(`Failed to parse return data from ${options.path}`)
    }
  }

  return {
    fetch,
    fetchText,
    fetchJson,
  }
}

const createAuthenticatedApiGateway = (
  gatewayUrl: string,
  pathPrefix = ''
) => {
  const getCredentials = async () => new Promise<SigningCredentials>((resolve, reject) => {
    AWS.config.getCredentials((err, credentials) => {
      if (err) {
        reject(err)
      } else if (!credentials) {
        reject(new Error('No credentials present'))
      } else {
        resolve(credentials)
      }
    })
  })

  return createSignedApiGateway(gatewayUrl, getCredentials, pathPrefix)
}

export {
  createSignedApiGateway,
  createAuthenticatedApiGateway,
}

export type {
  SigningCredentials,
  FetchOptions,
  FetchResult,
}
