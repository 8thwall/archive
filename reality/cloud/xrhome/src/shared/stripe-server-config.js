const {testKeys, prodKeys, VIEWS_PER_UNIT, getPlans} = require('./stripe-config')

const useProdSecrets = !BuildIf.ALL_QA

module.exports = {
  VIEWS_PER_UNIT,
  getPlans: () => getPlans(useProdSecrets),
  ...(useProdSecrets ? prodKeys : testKeys),
}
