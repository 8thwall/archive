type BaseConfig = {
  fieldName: string
  label: string
  groupId?: string
  order?: number
}

type BooleanConfigField = BaseConfig & {
  type: 'boolean'
  default?: boolean
  trueDescription?: string
  falseDescription?: string
}

type NumberConfigField = BaseConfig & {
  type: 'number'
  default?: number
  min?: number
  max?: number
}

type StringConfigField = BaseConfig & {
  type: 'string'
  default?: string
}

type Asset = {type: 'asset', asset: string}
type Url = {type: 'url', url: string}

type ResourceConfigField = BaseConfig & {
  type: 'resource'
  extensions?: string[]
  default?: Url | Asset
  labelForDefault?: string
  modifiedLabel?: boolean
}

type ModuleConfigField = StringConfigField | BooleanConfigField | NumberConfigField
 | ResourceConfigField

type ModuleConfigGroup = {
  groupId: string
  name: string
  order?: number
}

type ModuleConfig = {
  fields: Record<string, ModuleConfigField>
  groups?: Record<string, ModuleConfigGroup>
}

type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never

type ModuleConfigFieldPatch = Partial<DistributiveOmit<ModuleConfigField, 'fieldName'>>

export type {
  StringConfigField,
  BooleanConfigField,
  NumberConfigField,
  ResourceConfigField,
  ModuleConfigField,
  ModuleConfig,
  ModuleConfigFieldPatch,
  ModuleConfigGroup,
}
