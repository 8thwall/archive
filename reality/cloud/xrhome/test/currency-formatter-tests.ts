import {expect} from 'chai'

import {
  formatToCurrency, ZERO_DECIMAL_CURRENCY_ISO_CODES,
} from '../src/shared/billing/currency-formatter'

describe('Return behavior', () => {
  const currency = 'usd'
  const testAmount = 99
  it('Returns a string', () => {
    expect(formatToCurrency(testAmount, {currency})).to.be.a('string')
  })

  it('Doesn\'t throw when passing correct params', () => {
    expect(() => formatToCurrency(testAmount, {currency})).to.not.throw()
  })
})

describe('Properly formats currencies that use decimals', () => {
  it('Formats currencies that use decimals', () => {
    expect(formatToCurrency(99, {currency: 'usd'})).to.include('.')
    expect(formatToCurrency(36999, {currency: 'eur'})).to.include('.')
    expect(formatToCurrency(6999, {currency: 'zmw'})).to.include('.')
    expect(formatToCurrency(10000, {currency: 'kzt'})).to.include('.')
  })

  it('Formats US currency correctly', () => {
    expect(formatToCurrency(0, {currency: 'usd'})).to.equal('$0.00')
    expect(formatToCurrency(999, {currency: 'usd'})).to.equal('$9.99')
    expect(formatToCurrency(10099, {currency: 'usd'})).to.equal('$100.99')
  })

  it('Formats EU currency correctly', () => {
    expect(formatToCurrency(6049, {currency: 'eur'})).to.equal('€60.49')
    expect(formatToCurrency(50, {currency: 'eur'})).to.equal('€0.50')
    expect(formatToCurrency(10049, {currency: 'eur'})).to.equal('€100.49')
  })

  it('Formats British currency correctly', () => {
    expect(formatToCurrency(699, {currency: 'gbp'})).to.equal('£6.99')
    expect(formatToCurrency(1099, {currency: 'gbp'})).to.equal('£10.99')
  })
})

describe('Properly formats currencies that do not use decimals', () => {
  it('Formats currencies that do not use decimals', () => {
    ZERO_DECIMAL_CURRENCY_ISO_CODES.forEach((currency) => {
      expect(formatToCurrency(3000, {currency})).to.not.include('.')
    })
  })

  it('Formats Japanese currency correctly', () => {
    expect(formatToCurrency(100, {currency: 'jpy'})).to.equal('¥100')
    expect(formatToCurrency(1000, {currency: 'jpy'})).to.equal('¥1,000')
  })

  it('Formats Vietnamese currency correctly', () => {
    expect(formatToCurrency(600, {currency: 'vnd'})).to.equal('₫600')
  })
  /*
    NOTE(Brandon): Ugandan shilling is a special case where
    it was previously a decimal currency
    but turned into a no decimal currency. For backwards compatibility,
    the ugandan shilling is sent
    via stripe in quantities of N00's (ie, 100, 200, ..etc) and is
    converted to (1UGX, 2UGX, etc)
  */
  it('Formats Ugandan Shilling currency correctly', () => {
    expect(formatToCurrency(1000, {currency: 'ugx'})).to.equal('UGX 10')
  })
})

describe('Properly formats amount to US Dollars when a currency is not passed in', () => {
  it('Doesn\'t throw when a currency param is not passed', () => {
    expect(() => formatToCurrency(500)).to.not.throw()
  })

  it('Formats amounts when a currency param is not passed', () => {
    expect(formatToCurrency(500)).to.equal('$5.00')
  })
})

describe('Properly errors out when inputs are incorrect', () => {
  it('Throws an error when a non number is passed in to the first param', () => {
    expect(() => formatToCurrency('NotANumber', {currency: 'usd'})).to.throw(Error)
  })

  it('Throws an error when a currency that is not supported is passed in', () => {
    expect(() => formatToCurrency(2000, {currency: 'xyz'})).to.throw(Error)
  })
})
