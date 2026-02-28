// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Scott Pollack (scott@8thwall.com)
//
// Entry point for worker, should only be called from client.ts

// Module imports
import g8 from './g8-git'
import * as fs from './g8'

// List of modules, keep in sync with client.ts
const modules = {
  g8,
  fs,
}

const fnqueue = []

const drainQueue = () => {
  if (!fnqueue.length) {
    return
  }
  const fn = fnqueue[0]
  fn().then(() => {
    fnqueue.shift()
    drainQueue()
  })
}

onmessage = ({data}) => {
  const {id, module, method, args} = data

  if (!modules[module]) {
    // @ts-ignore
    postMessage({
      id,
      error: true,
      response: `No such module '${module}'.  Modules=${JSON.stringify(Object.keys(modules))}`,
    })
    return
  }

  const fn = modules[module][method]
  if (!fn) {
    // @ts-ignore
    postMessage({
      id,
      error: true,
      response: `Bad method '${module}.${method}'. Methods=${JSON.stringify(Object.keys(module))}`,
    })
    return
  }

  fnqueue.push(() => fn(...args)
    // @ts-ignore
    .then(response => postMessage({id, error: false, response}))
    // @ts-ignore
    .catch(error => postMessage({
      id,
      error: true,
      response: error ? error.message || error.toString() : `${error}`,
    })))

  // If the queue length is greater than 1, it is already draining.
  if (fnqueue.length === 1) {
    drainQueue()
  }
}
