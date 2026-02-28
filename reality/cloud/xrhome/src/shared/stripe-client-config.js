const {testKeys, prodKeys, VIEWS_PER_UNIT, getPlans} = require('./stripe-config')

module.exports = {
  getPlans,
  VIEWS_PER_UNIT,
  ...(BuildIf.ALL_QA ? testKeys : prodKeys),
}
