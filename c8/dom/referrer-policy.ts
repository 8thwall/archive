// @sublibrary(:dom-core-lib)
import {
  extractHeaderListValues,
} from './fetch-methods'

// See https://w3c.github.io/webappsec-referrer-policy/#referrer-policy
type ReferrerPolicy = '' | 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' |
  'origin-when-cross-origin' | 'same-origin' | 'strict-origin' |
  'strict-origin-when-cross-origin' | 'unsafe-url'

const isReferrerPolicy = (token: string): boolean => [
  '',
  'no-referrer',
  'no-referrer-when-downgrade',
  'origin',
  'origin-when-cross-origin',
  'same-origin',
  'strict-origin',
  'strict-origin-when-cross-origin',
  'unsafe-url',
].includes(token.toLowerCase())

// Given a response response, the following steps return a referrer policy
// according to response’s `Referrer-Policy` header:
// See: https://w3c.github.io/webappsec-referrer-policy/#parse-referrer-policy-from-header
const parseReferrerPolicy = (response: Response): ReferrerPolicy => {
  // 1. Let policy-tokens be the result of extracting header list values given
  // `Referrer-Policy` and response’s header list.
  const policyTokens = extractHeaderListValues('Referrer-Policy', response.headers)

  // 2. Let policy be the empty string.
  let policy = ''

  // 3. For each token in policy-tokens, if token is a referrer policy and token
  // is not the empty string, then set policy to token.
  // Note: This algorithm loops over multiple policy values to allow deployment
  // of new policy values with fallbacks for older user agents, as described in
  // Section 11.1 Unknown Policy Values.
  if (policyTokens !== null) {
    policyTokens.forEach((token) => {
      if (isReferrerPolicy(token) && token !== '') {
        policy = token
      }
    })
  }
  // 4. Return policy.
  return policy as ReferrerPolicy
}

export {ReferrerPolicy, parseReferrerPolicy, isReferrerPolicy}
