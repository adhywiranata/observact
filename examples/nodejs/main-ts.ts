import {createStore, createMiddleware, loggerMiddleware} from 'observact'

console.log(createMiddleware)

const myStore = createStore({
  domains: [
    {key: 'cart', persist: true, value: []},
    {key: 'theme', value: 'light'}
  ],
  middlewares: [loggerMiddleware]
})

console.log(myStore.get('theme'))
myStore.observe('theme', (val) => console.log('wow! change theme to', val))
myStore.observe('theme', (val) => console.log('listener kedua', val))

myStore.set('theme', 'dark')

myStore.clearObservers()

myStore.set('theme', 'light')
myStore.set('theme', 'dark')
myStore.set('theme', 'shade')
console.log(myStore.get('theme'))
