// TODO(christoph): Add more types like number/boolean
type ModuleRuntimeConfigPrimitive = string | boolean | number

type ModuleRuntimeConfig = Record<string, ModuleRuntimeConfigPrimitive>

export type {
  ModuleRuntimeConfigPrimitive,
  ModuleRuntimeConfig,
}
