// @sublibrary(:dom-core-lib)
import type {USVString} from './strings'

// See: https://url.spec.whatwg.org/#concept-domain
type Domain = USVString
type Host = typeof URL.prototype.host

interface Origin {}
interface OpaqueOrigin extends Origin {}
interface TupleOrigin extends Origin {
  scheme: string
  host: Host
  port: null | typeof URL.prototype.port
  domain: null | Domain
}

export {Domain, Host, Origin, OpaqueOrigin, TupleOrigin}
