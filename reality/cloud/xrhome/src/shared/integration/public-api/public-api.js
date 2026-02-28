const registry = require('../../registry')

const key = registry.key('public-api')

const register = (c) => {
  registry.register(key, c)
}

const use = () => (
  registry.get(key)
)

module.exports = {
  register,
  use,
}
