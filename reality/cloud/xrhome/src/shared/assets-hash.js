const defaultOptions = {
  randomLength: 4,
  base: 36,
  stringLength: 10,
}

const encode = (word, random, options = {}) => {
  const {base, stringLength} = Object.assign(defaultOptions, options)
  const stringify = v => v.map(i => i.toString(base)).join('')

  const c = word.split('').map((w, i) => (random[i % random.length] * parseInt(w, base)))
  return (stringify(random) + stringify(c)).substring(0, stringLength)
}

const hash = (word, options = {}) => {
  const {randomLength, base} = Object.assign(defaultOptions, options)
  const r = new Array(randomLength).fill(1)
    .map(_ => Math.floor(Math.random() * (base - 1)) + 1)
  return encode(word, r, options)
}

const verify = (word, code, options = {}) => {
  const {randomLength, base} = Object.assign(defaultOptions, options)
  const r = code.substr(0, randomLength).split('').map(i => parseInt(i, base))
  return encode(word, r, options) === code
}

const pverify = (word, code, options = {}) => verify(word, code, options) || verify('public', code, options)

module.exports = {hash, verify, pverify}
