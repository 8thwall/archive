import type {DeepReadonly} from 'ts-essentials'

type SecretValue = {
  type: 'secret'
  secretId: string
  lastCouple?: string
  length?: number
  allowedOrigin?: string
}

type SecretSlotParameter = {
  type: 'secretslot'
  prefix?: string
} & BaseSlotParameter

type LiteralSlotParameter = {
  type: 'literalslot'
} & BaseSlotParameter

type PassthroughParameter = {
  type: 'passthrough'
}

type ParameterValue = {type: 'literal', value: string} |
                      PassthroughParameter |
                      SecretValue | SecretSlotParameter | LiteralSlotParameter

type HeadersConfig = Record<string, ParameterValue>
type EnvVariableConfig = Record<string, LiteralSlotParameter>
type RouteMethod = 'GET' | 'PATCH' | 'HEAD' | 'POST' | 'PUT' | 'DELETE'

type RouteConfig = {
  name: string
  id: string
  url: string
  methods: RouteMethod[]
  headers: HeadersConfig
}

interface FunctionDefinition {
  type: 'function'
  name?: string
  title?: string
  description?: string
  entry?: string
  envVariables?: EnvVariableConfig
  headers?: HeadersConfig
}

interface ProxyDefinition {
  type?: 'proxy'
  name?: string
  title?: string
  description?: string
  baseUrl?: string
  headers?: HeadersConfig
  routes: RouteConfig[]
}

type GatewayDefinition = FunctionDefinition | ProxyDefinition

type BaseSlotParameter = {
  slotId: string
  label: string
};

type SlotParameter = SecretSlotParameter | LiteralSlotParameter

type ProxyConfigFieldPatch = Partial<RouteConfig> |
  Omit<ProxyDefinition, 'name' |'description' | 'headers' | 'routes'>

type FunctionConfigFieldPatch = Pick<FunctionDefinition, 'entry'>

type GatewayName = string
type RouteName = string
type RouteId = string
type ModuleId = string

interface ClientGatewayInfo {
  url: string
  gatewayMappings: Record<GatewayName, Record<RouteName, RouteId>>
  moduleGatewayMappings: Record<ModuleId, Record<GatewayName, Record<RouteName, RouteId>>>
}

type RequestInit = Parameters<typeof fetch>[1]
type RouteFunction = (first: string | RequestInit, second?: RequestInit) => Promise<Response>
type GatewayHandle = Record<string, RouteFunction>

type SlotValues = Record<string, ParameterValue>

type ValidationOptions = DeepReadonly<{
  expectName?: boolean
  allowSlot?: boolean
  allowSecretSlot?: boolean
  allowSecret?: boolean
}>

export type {
  ParameterValue,
  HeadersConfig,
  RouteMethod,
  RouteConfig,
  GatewayDefinition,
  SlotParameter,
  ClientGatewayInfo,
  ProxyConfigFieldPatch,
  RequestInit,
  RouteFunction,
  GatewayHandle,
  SlotValues,
  SecretValue,
  ValidationOptions,
  ProxyDefinition,
  FunctionDefinition,
  FunctionConfigFieldPatch,
  EnvVariableConfig,
}
