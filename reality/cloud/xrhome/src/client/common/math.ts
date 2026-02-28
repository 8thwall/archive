const isFloatEqual = (a: number, b: number): boolean => Math.abs(a - b) < 1e-5

export {
  isFloatEqual,
}
