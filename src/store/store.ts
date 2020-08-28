import {
  DomainKey,
  DomainVal,
  ObserverMap,
  DomainMapStore,
  StoreMiddleware,
  ObserverHandler,
  StoreConstructorArgs,
  ObservactStore,
} from '../types'

/**
 * Global Store for all states across domains
 */
class Store implements ObservactStore {
  /** Collection of active observers with handlers inside each. */
  #observers: ObserverMap[]
  /** Collection of domain-based data of the Store. */
  #domains: DomainMapStore[]
  /** Collection of domain keys for faster lookup operations. */
  #domainLookupKeys: string[]
  /** Collection of registered middlewares compatible to the Store. */
  #middlewares: StoreMiddleware[]

  public constructor(storeInitiator: StoreConstructorArgs) {
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
    const isFound = this.#domainLookupKeys.includes(domainKey)
    if (!isFound) {
      console.error('domain `' + domainKey + '` is not specified during `createStore` phase.')
    }

    return isFound
  }

  /**
   * Retrieves the current value of the domain data
   * @param domainKey Domain data key to retrieve
   * @returns value inside the domain key
   */
  public get(domainKey: DomainKey): DomainVal {
    if(!this.validateDomainExistence(domainKey)) {
      return null
    }

    return this.#domains[this.#domainLookupKeys.indexOf(domainKey)].value
  }

  /**
   * Set the value of a domain and triggers the observers listening to it
   * @param domainKey Domain data key to mutate
   * @param value New value of the key
   */
  public set(domainKey: DomainKey, value: DomainVal): void {
    // input validations
    if(!this.validateDomainExistence(domainKey)) {
      return;
    }

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

export default Store