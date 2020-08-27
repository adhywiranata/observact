export interface DomainMapStore {
  key: string // unique domain key. the top level for the observer to observe
  persist?: boolean // flag to ensure that this domain is persistent using specific persistance engine
  reactOnlyOnChange?: boolean // flag to ensure reactivity only reacts on value change
  value: any // actual value of the store. May contain object or any data type
}

export interface ObserverMap {
  key: string // domain key
  onChange: any // callback-style function to invoke during value change
}

export interface StoreMiddleware {
  name: string // middleware display name
  exec: Function
}

export interface StoreCreationDTO {
  domains: DomainMapStore[]
  middlewares?: StoreMiddleware[]
}