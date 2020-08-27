type DomainKey = string
type DomainVal = any

/** Map of domain data inside the Store */
interface DomainMapStore {
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
interface DomainKeyVal {
  key: DomainKey
  value: DomainVal
}

/** Arguments for middleware handler */
interface MiddlewareHandlerArg {
  store: Store
  incomingMutation: DomainKeyVal
}

/** Function which runs the actual process or implementation details of the middleware. */
type MiddlewareHandler = (arg: MiddlewareHandlerArg) => void

/** Function which runs when a specific observer responds to a mutation */
type ObserverHandler = (value: DomainVal) => void

interface ObserverMap {
  key: DomainKey
  act: ObserverHandler
}

interface StoreMiddleware {
  name: string
  exec: MiddlewareHandler
}

interface StoreCreationDTO {
  domains: DomainMapStore[]
  middlewares?: StoreMiddleware[]
}

/**
 * Global Store for all states across domains
 */
class Store {
  /** Collection of active observers with handlers inside each. */
  #observers: ObserverMap[]
  /** Collection of domain-based data of the Store. */
  #domains: DomainMapStore[]
  /** Collection of domain keys for faster lookup operations. */
  #domainLookupKeys: string[]
  /** Collection of registered middlewares compatible to the Store. */
  #middlewares: StoreMiddleware[]

  public constructor(storeInitiator: StoreCreationDTO) {
    this.#observers = []
    this.#middlewares = [].concat(storeInitiator.middlewares || [])
    this.#domains = storeInitiator.domains
    this.#domainLookupKeys = storeInitiator.domains.map(sI => sI.key)
  }

  /**
   * Validates the existence of the domain key inside the store
   * @param domainKey Domain data key to validate
   */
  private validateDomainExistence(domainKey: DomainKey) {
    if (!this.#domainLookupKeys.includes(domainKey)) {
      throw Error('domain `' + domainKey + '` is not specified during `createStore` phase.')
    }
  }

  /**
   * Retrieves the current value of the domain data
   * @param domainKey Domain data key to retrieve
   * @returns value inside the domain key
   */
  public get(domainKey: DomainKey): DomainVal {
    this.validateDomainExistence(domainKey)
    return this.#domains[this.#domainLookupKeys.indexOf(domainKey)].value
  }

  /**
   * Set the value of a domain and triggers the observers listening to it
   * @param domainKey Domain data key to mutate
   * @param value New value of the key
   */
  public set(domainKey: DomainKey, value: DomainVal): void {
    // input validations
    this.validateDomainExistence(domainKey)

    // run registered middlewares to process values based on current store
    this.#middlewares.forEach(middleware => {
      middleware.exec({
        store: this,
        incomingMutation: {
          key: domainKey,
          value,
        }
      })
    })

    // do the actual mutation process
    this.#domains[this.#domainLookupKeys.indexOf(domainKey)].value = value
    this.#observers.forEach(obsv => {
      if (obsv.key === domainKey) {
        obsv.act(value)
      }
    })
  }

  /**
   * Registers a listener based on changes on the domain key
   * @param domainKey Key of the domain data to attach a handler to
   * @param handler Callback function which responds to value changes
   */
  public observe(domainKey: DomainKey, handler: ObserverHandler): void {
    this.validateDomainExistence(domainKey)
    this.#observers.push({
      key: domainKey,
      act: handler,
    })
  }

  // unregisters all listeners. This won't do anything to the middleware
  public clearObservers(): void {
    this.#observers = []
  }
}

/**
 * Creates Store middleware to get or mutate values inside the Store
 * @param fn Function that do the work using the provided store
 * @param name Name of the middleware
 * @returns StoreMiddleware
 */
function createMiddleware (fn: MiddlewareHandler, name: string): StoreMiddleware {
  return {
    name,
    exec: (arg: MiddlewareHandlerArg): void => fn(arg),
  }
}

/**
 * Factory function which creates a Store which consists of data domains
 * @param storeInitiator Store definition
 * @returns Store
 */
function createStore(storeInitiator: StoreCreationDTO): Store {
  return new Store(storeInitiator)
}

export {createMiddleware, createStore}