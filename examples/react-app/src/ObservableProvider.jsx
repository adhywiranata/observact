import React from 'react'
import {createStore} from 'observact'

const ObservactContext = React.createContext()

export const useDomain = () => {
  const {store} = React.useContext(ObservactContext)
  return {
    get: (domainKey) => store.get(domainKey)
  }
}

export const useMutation = () => {
  const {store, setter} = React.useContext(ObservactContext)
  return {
    set: (domainKey, value) => {
      store.set(domainKey, value)
      setter(store)
    }
  }
}

const DomainProvider = ({storeConfig, children}) => {
  const [currentStore, setStore] = React.useState(createStore(storeConfig))
  const passedDownVal = {
    store: currentStore,
    setter: (mutatedStore) => {
      const newStoreDomainConfig = currentStore
        .getDomainKeys()
        .map(dk => ({ key: dk, value: mutatedStore.get(dk)}))

      const newStore = createStore({...storeConfig, domains: [...newStoreDomainConfig]})
      setStore(newStore)
    }
  }

  return (
    <ObservactContext.Provider value={passedDownVal}>
      {children}
    </ObservactContext.Provider>
  )
}

export default DomainProvider