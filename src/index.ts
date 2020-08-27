import {
  ObserverMap,
  DomainMapStore,
  StoreMiddleware,
  StoreCreationDTO,
} from './types'

class Store {
  observers: ObserverMap[]
  domains: DomainMapStore[]
  domainLookupKeys: string[]
  middlewares: StoreMiddleware[]

  constructor(storeInitiator: StoreCreationDTO) {
    this.observers = []
    this.middlewares = [].concat(storeInitiator.middlewares || [])
    this.domains = storeInitiator.domains
    this.domainLookupKeys = storeInitiator.domains.map(sI => sI.key)
  }

  // validate domain key existence
  validateDomainExistence(domainKey: string) {
    if (!this.domainLookupKeys.includes(domainKey)) {
      throw Error('domain `' + domainKey + '` is not specified during `createStore` phase.')
    }
  }

  // get the current value of a domain
  get(domainKey: string) {
    this.validateDomainExistence(domainKey)
    return this.domains[this.domainLookupKeys.indexOf(domainKey)].value
  }

  // set the value of a domain and triggers the observers listening to it
  set(domainKey: string, value: any) {
    // input validations
    this.validateDomainExistence(domainKey)

    // run registered middlewares to process values based on current store
    this.middlewares.forEach(middleware => {
      middleware.exec({
        store: this,
        incomingMutation: {
          key: domainKey,
          value,
        }
      })
    })

    // do the actual mutation process
    this.domains[this.domainLookupKeys.indexOf(domainKey)].value = value
    this.observers.forEach(obsv => {
      if (obsv.key === domainKey) {
        obsv.onChange(value)
      }
    })
  }

  // registers a listener based on changes on the domain key
  observe(domainKey: string, cb: any) {
    this.validateDomainExistence(domainKey)
    this.observers.push({
      key: domainKey,
      onChange: cb,
    })
  }

  // unregisters all listeners. This won't do anything to the middleware
  clearObservers() {
    this.observers = []
  }
}

const createMiddleware = function (fn: any, name: string): StoreMiddleware {
  return {
    name,
    exec: (storeCtx) => fn(storeCtx),
  }
}

const createStore = function (storeInitiator: StoreCreationDTO) {
  return new Store(storeInitiator)
}

export {createMiddleware, createStore}