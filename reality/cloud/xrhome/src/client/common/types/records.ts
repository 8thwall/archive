type PartialRecord<K extends string | number | symbol, V> = {
  [P in K]?: V
}

export type {
  PartialRecord,
}
