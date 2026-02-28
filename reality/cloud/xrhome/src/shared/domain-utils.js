const {parseDomain, ParseResultType} = require('parse-domain')

const combineSubdomain = (subdomain, root) => `${subdomain ? `${subdomain}.` : ''}${root}`

const getRootDomain = (domainName) => {
  const {type, domain, topLevelDomains} = parseDomain(domainName)
  if (type !== ParseResultType.Listed || !domain || !topLevelDomains) {
    return null
  }
  return [domain, ...topLevelDomains].join('.')
}

const getSubdomain = (domainName) => {
  const {type, subDomains} = parseDomain(domainName)
  if (type !== ParseResultType.Listed || !subDomains) {
    return null
  }
  return subDomains.join('.')
}

// Domain can only be constructed from rootDomain and subdomain, no path, protocol, etc
const isValidDomain = (domainName) => {
  const subdomain = getSubdomain(domainName)
  const rootDomain = getRootDomain(domainName)

  // Disallow deeper subdomains like sub1.sub2.example.com
  if (subdomain && subdomain.indexOf('.') !== -1) {
    return false
  }

  if (combineSubdomain(subdomain, rootDomain) !== domainName) {
    return false
  }

  return true
}

// Connected domains follow the form tld.domain.(subdomain1|subdomain2), examples:
//   com.8thwall.(www|apps)
//   uk.co.agency.(|www)
//   com.example.(www)
//   net.example.()

const serializeConnectedDomain = (rootDomain, subdomains) => (
  `${rootDomain.split('.').reverse().join('.')}.(${subdomains.join('|')})`
)

const parseConnectedDomain = (connectedDomain) => {
  if (!connectedDomain) {
    return null
  }
  const mainMatch = connectedDomain.match(/^([a-z0-9-_.]+)\.\(([a-z0-9\-_.|]*)\)$/)
  if (!mainMatch) {
    return null
  }

  const [, reverseUrlString, subdomainsString] = mainMatch

  const rootDomain = reverseUrlString.split('.').reverse().join('.')

  return {
    rootDomain,
    subdomains: subdomainsString.split('|'),
  }
}

const parseConnectedDomainFull = (connectedDomain) => {
  const parsed = parseConnectedDomain(connectedDomain)

  if (!parsed) {
    return null
  }

  const {rootDomain, subdomains} = parsed

  if (!rootDomain || !subdomains || !subdomains.length) {
    return null
  }

  const domainName = combineSubdomain(subdomains[0], rootDomain)
  const redirectDomains = subdomains.slice(1)
    .map(subdomain => combineSubdomain(subdomain, rootDomain))

  return {
    domainName,
    redirectDomains,
  }
}

const connectedDomainHasDomain = (connectedDomain, domain) => {
  if (!connectedDomain) {
    return false
  }

  const parsedDomains = parseConnectedDomainFull(connectedDomain)

  if (!parsedDomains) {
    return false
  }

  if (parsedDomains.domainName === domain) {
    return true
  }

  return parsedDomains.redirectDomains.includes(domain)
}

module.exports = {
  combineSubdomain,
  getSubdomain,
  getRootDomain,
  isValidDomain,
  serializeConnectedDomain,
  parseConnectedDomain,
  parseConnectedDomainFull,
  connectedDomainHasDomain,
}
