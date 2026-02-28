import {chai, chaiAsPromised} from 'bzl/js/chai-js'

import {maxConcurrent} from './max-concurrent'

const {describe, it} = globalThis as any
const {expect} = chai

chai.use(chaiAsPromised)

describe('max-concurrent', () => {
  it('should limit max', () => {
    // Test promise that keeps track of how many times it has run, and the max number that were run
    // concurrently.
    let maxActive_ = 0
    let total_ = 0
    let active_ = 0
    const promise = () => {
      ++active_
      ++total_
      if (active_ > maxActive_) {
        maxActive_ = active_
      }
      return Promise.resolve().then(() => {--active_})
    }

    // Set a limit of 5 max.
    const mc = maxConcurrent<void>(5)

    // Add 10 promises.
    let promises: Promise<void>[] = []
    for (let i = 0; i < 10; ++i) {
      promises.push(mc.add(promise))
    }

    // Run until all promises are resolved.
    const run = async (p) => {
      await (Promise.all(p))
      return {active: active_, maxActive: maxActive_, total: total_}
    }

    // We expect that all 0 are still running, all 10 ran, and at most 5 were active at once.
    expect(run(promises)).to.eventually.deep.equal({
      active: 0,
      maxActive: 5,
      total: 10,
    })
  })

  it('should not limit max', () => {
    // Similar test to above, but now the max is 15, so we don't reach it.
    let maxActive_ = 0
    let total_ = 0
    let active_ = 0
    const promise = () => {
      ++active_
      ++total_
      if (active_ > maxActive_) {
        maxActive_ = active_
      }
      return Promise.resolve().then(() => {--active_})
    }
    const mc = maxConcurrent<void>(15)
    let promises: Promise<void>[] = []
    for (let i = 0; i < 10; ++i) {
      promises.push(mc.add(promise))
    }

    const run = async (p) => {
      await (Promise.all(p))
      return {active: active_, maxActive: maxActive_, total: total_}
    }

    expect(run(promises)).to.eventually.deep.equal({
      active: 0,
      maxActive: 10,
      total: 10,
    })
  })
})
