import {
  StoreConstructorArgs,
  ObservactStore,
} from '../types'

import { default as Store } from './store'

/**
 * Factory function which creates a Store which consists of data domains
 * @param storeInitiator Store definition
 * @returns Store
 */
function createStore(storeInitiator: StoreConstructorArgs): ObservactStore {
  return new Store(storeInitiator)
}

export default createStore