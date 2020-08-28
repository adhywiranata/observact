import { Domain } from "domain"

export type DomainKey = string
export type DomainVal = any

/** Public API of ObservactStore */
export interface ObservactStore {
  get(domainName: DomainKey): DomainVal
  set(domainKey: DomainKey, value: DomainVal): void
}

/** Map of domain data inside the Store */
export interface DomainMapStore {
  /** Unique domain key. The top level for the observer to observe. */
  key: DomainKey
  /** Flag to ensure that this domain is persistent using specific persistance engine. */
  persist?: boolean
  /** Flag to ensure reactivity only reacts on value change. */
  reactOnlyOnChange?: boolean
  /** Actual value of the domain data inside the store. */
  value: DomainVal
}

/** Key Value pair of domain data. */
export interface DomainKeyVal {
  key: DomainKey
  value: DomainVal
}

/** Function which runs when a specific observer responds to a mutation */
export type ObserverHandler = (value: DomainVal) => void

export interface ObserverMap {
  key: DomainKey
  act: ObserverHandler
}

export interface StoreConstructorArgs {
  domains: DomainMapStore[]
  middlewares?: StoreMiddleware[]
}

/** Arguments for middleware handler */
export interface MiddlewareHandlerArgs {
  store: ObservactStore
  incomingMutation: DomainKeyVal
}

/** Function which runs the actual process or implementation details of the middleware. */
export type MiddlewareHandler = (arg: MiddlewareHandlerArgs) => void

export interface StoreMiddleware {
  name: string
  exec: MiddlewareHandler
}