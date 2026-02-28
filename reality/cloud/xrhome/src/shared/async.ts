/* eslint-disable arrow-parens */

// NOTE(christoph): Promise.all resolves on the first error, which leaves other pending promises
// still running. If you want to wait until all promises are either resolved or rejected,
// use this utility.
const resolveAll = async <T>(promises: Promise<T>[]) => {
  const results = await Promise.allSettled(promises)
  return results.map(result => {
    if (result.status === 'fulfilled') {
      return result.value
    }
    throw result.reason
  })
}

export {
  resolveAll,
}
