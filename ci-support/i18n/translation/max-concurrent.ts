interface PromiseResolver<Type> {
  resolve: (Type) => void,
  reject: (any) => void,
  promise: () => Promise<Type>,
  wrapper: Promise<Type>,
}

const maxConcurrent = <Type>(max: number) => {
  let active_ = 0

  const resolveQueue_ : PromiseResolver<Type>[] = []

  const run = async (resolver: PromiseResolver<Type>): Promise<void> => {
    ++active_

    try {
      resolver.resolve(await resolver.promise())
    } catch (e) {
      resolver.reject(e)
    } finally {
      --active_
      const next = resolveQueue_.shift()
      if (next) {
        run(next)
      }
    }
  }

  const resolver = (promise: () => Promise<Type>): PromiseResolver<Type> => {
    let resolve_ : (Type) => void = () => {}
    let reject_ : (any) => void = () => {}
    const wrapper = new Promise<Type>((resolve, reject) => {
      resolve_ = resolve
      reject_ = reject
    })

    return {resolve: resolve_, reject: reject_, promise, wrapper}
  }

  const add = (promise: () => Promise<Type>): Promise<Type> => {
    const r = resolver(promise)
    if (active_ < max) {
      // If we can start the promise now, start it now.
      run(r)
    } else {
      // Otherwise, add it to the queue to be started later.
      resolveQueue_.push(r)
    }
    return r.wrapper
  }

  return {
    add,
  }
}

const rateLimiter = <Type>(hz: number) => {
  let nextOkMillis_ = 0

  const add = (promise: () => Promise<Type>): Promise<Type> => {
    const now = Date.now()
    const timeToWait = nextOkMillis_ - now
    nextOkMillis_ = Math.max(now, nextOkMillis_) + (1.0 / hz) * 1000.0

    if (timeToWait <= 0) {
      return promise()
    }

    return new Promise<Type>((resolve, reject) => {
      setTimeout(() => promise().then(resolve).catch(reject), timeToWait)
    })
  }

  return {
    add,
  }
}

const maxConcurrentWithRateLimit = <Type>(max: number, hz: number) => {
  const mc = maxConcurrent<Type>(max)
  const rl = rateLimiter<Type>(hz)
  const add = (promise: () => Promise<Type>): Promise<Type> => (
    rl.add(() => mc.add(promise))
  )
  return {
    add,
  }
}

export {
  maxConcurrent,
  maxConcurrentWithRateLimit,
  rateLimiter,
}
