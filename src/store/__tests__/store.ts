import { createStore, createMiddleware, loggerMiddleware } from '../../../src'

const fakeThemeInitialData = {
  key: 'theme',
  value: 'light'
}

const alternativeThemeValue = 'dark'

const fakeCartInitialData = {
  key: 'shopping-cart',
  value: []
}

const fakeProfileInitialData = {
  key: 'profile',
  value: {
    firstName: 'Observee',
    lastName: 'Acticia',
    email: 'observee@acticia.doesnot.exist',
  }
}

const alternativeProfileValue = {
  firstName: 'N/A',
  lastName: 'N/A',
  email: 'observee@acticia.doesnot.exist',
}

const fakeSingleDomainData = [
  {...fakeThemeInitialData},
]

const fakeMultipleDomainData = [
  {...fakeThemeInitialData},
  {...fakeCartInitialData},
  {...fakeProfileInitialData},
]

test('Store able to be created successfully with no data', () => {
  const store = createStore({ domains: [] })

  expect(store).toBeDefined()
})

test('Store able to be created successfully with basic data', () => {
  const store = createStore({ domains: fakeSingleDomainData })

  expect(store).toBeDefined()
})

test('Store able get initial domain data', () => {
  const store = createStore({ domains: fakeSingleDomainData })
  const {key, value} = fakeThemeInitialData

  expect(store.get(key)).toBeDefined()
  expect(store.get(key)).toEqual(value)
})

test('Store will return null value when getting invalid domain key', () => {
  const store = createStore({ domains: fakeSingleDomainData })

  expect(store.get('non-existent-domain-key')).toEqual(null)
})

test('Store able to set domain data', () => {
  const store = createStore({ domains: fakeSingleDomainData })
  const {key} = fakeThemeInitialData
  const nextExpectedValue = alternativeThemeValue
  const revertedValue = fakeThemeInitialData.value

  expect(store.get(key)).toEqual(fakeThemeInitialData.value)
  store.set(key, nextExpectedValue)
  expect(store.get(key)).toEqual(nextExpectedValue)
  store.set(key, revertedValue)
  expect(store.get(key)).toEqual(revertedValue)
})

test('Store does nothing when setting non-existent domain data', () => {
  const store = createStore({ domains: fakeSingleDomainData })

  store.set('non-existent-key', 42)
  expect(store.get('non-existent-key')).toEqual(null)
  expect(store.get('non-existent-key')).not.toEqual(42)
})

test('Store able to receive built-in middlewares', () => {
  const store = createStore({ domains: fakeSingleDomainData, middlewares: [loggerMiddleware] })
  const {key, value} = fakeThemeInitialData

  // invoke the middleware
  store.set(key, value)
  expect(store.get(key)).toEqual(value)
})

test('Store able to receive custom middlewares', () => {
  const mockMiddlewareImplementation = jest.fn()
  const fakeMiddleware = createMiddleware(mockMiddlewareImplementation, 'mock-middleware')
  const store = createStore({ domains: fakeSingleDomainData, middlewares: [fakeMiddleware] })
  const {key, value} = fakeThemeInitialData

  // invoke the middleware
  store.set(key, value)
  expect(store.get(key)).toEqual(value)
  expect(mockMiddlewareImplementation).toBeCalledTimes(1)
  expect(mockMiddlewareImplementation).toBeCalledWith({store, incomingMutation: {key, value}})
})

test('Store able to attach observer handler and act on it', () => {
  const mockHandler = jest.fn()

  const store = createStore({ domains: fakeSingleDomainData })
  const {key} = fakeThemeInitialData
  const nextExpectedValue = alternativeThemeValue
  const revertedValue = fakeThemeInitialData.value

  store.observe(key, mockHandler)
  store.set(key, nextExpectedValue)

  expect(mockHandler).toBeCalledTimes(1)
  expect(mockHandler).toBeCalledWith(nextExpectedValue)

  store.set(key, revertedValue)
  expect(mockHandler).toBeCalledTimes(2)
  expect(mockHandler).toBeCalledWith(revertedValue)

  store.clearObservers()
  store.set(key, revertedValue)

  // expect no handler will be called after observer has been cleared
  expect(mockHandler).toBeCalledTimes(2)
})

test('Store with multiple domains data able to attach multiple observer handlers and act on it', () => {
  const mockThemeHandler = jest.fn()
  const mockProfileHandler = jest.fn()

  const store = createStore({ domains: fakeMultipleDomainData })

  const nextExpectedThemeValue = alternativeThemeValue
  const revertedThemeValue = fakeThemeInitialData.value

  const nextExpectedProfileValue = alternativeProfileValue

  const revertedProfileValue = fakeProfileInitialData.value

  // register observers
  store.observe(fakeThemeInitialData.key, mockThemeHandler)
  store.observe(fakeProfileInitialData.key, mockProfileHandler)

  store.set(fakeThemeInitialData.key, nextExpectedThemeValue)
  expect(mockThemeHandler).toBeCalledTimes(1)
  expect(mockThemeHandler).toBeCalledWith(nextExpectedThemeValue)

  store.set(fakeProfileInitialData.key, nextExpectedProfileValue)
  expect(mockProfileHandler).toBeCalledTimes(1)
  expect(mockProfileHandler).toBeCalledWith(nextExpectedProfileValue)

  store.set(fakeThemeInitialData.key, revertedThemeValue)
  expect(mockThemeHandler).toBeCalledTimes(2)
  expect(mockThemeHandler).toBeCalledWith(revertedThemeValue)

  store.set(fakeProfileInitialData.key, revertedProfileValue)
  expect(mockProfileHandler).toBeCalledTimes(2)
  expect(mockProfileHandler).toBeCalledWith(revertedProfileValue)

  store.clearObservers()
  store.set(fakeThemeInitialData.key, revertedThemeValue)
  store.set(fakeProfileInitialData.key, revertedProfileValue)

  // expect no handler will be called after observer has been cleared
  expect(mockThemeHandler).toBeCalledTimes(2)
  expect(mockProfileHandler).toBeCalledTimes(2)
})

test('Store will return a list of domain keys', () => {
  const store = createStore({ domains: fakeMultipleDomainData })

  expect(store.getDomainKeys()).toEqual(fakeMultipleDomainData.map(dd => dd.key))
})