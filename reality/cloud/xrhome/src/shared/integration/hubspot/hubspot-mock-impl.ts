import Hubspot from 'hubspot'

const createMockHubspot = (): Hubspot => (
  new Hubspot({
    accessToken: 'not-a-real-token',
    checkLimit: true,
  })
)

export {
  createMockHubspot,
}
