// @attr(visibility = ["//visibility:public"])

type ToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? T extends Capitalize<T>
    ? `_${Lowercase<T>}${ToSnakeCase<U>}`
    : `${T}${ToSnakeCase<U>}`
  : S

type WithSnakeCaseKeys<T> = {
  [K in keyof T as ToSnakeCase<string & K>]: T[K]
}

const camelToSnakeCase = <T extends object>(
  body: T
) => Object.entries(body).reduce((result, [key, value]) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    result[snakeKey] = value
    return result
  }, {} as WithSnakeCaseKeys<T>)

export {
  camelToSnakeCase,
}

export type {
  WithSnakeCaseKeys,
}
