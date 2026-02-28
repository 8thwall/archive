#!/usr/local/bin/node

// # Usage: ./scripts/sign-jwt.js "my-secret" "{exp: 123, format: 'relaxed'}"

const {sign} = require('jsonwebtoken')
const JSON5 = require('json5')

const run = (secret, json) => {
  const payload = JSON5.parse(json)
  // eslint-disable-next-line no-console
  console.log(sign(payload, secret))
}

run(...process.argv.slice(2))
