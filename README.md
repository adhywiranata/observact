# Observact

[![npm](https://badgen.net/npm/v/observact)](https://badgen.net/npm/v/observact)
[![minzip](https://badgen.net/bundlephobia/minzip/observact)](https://badgen.net/bundlephobia/minzip/observact)
[![deps](https://badgen.net/david/dep/adhywiranata/observact)](https://badgen.net/david/dep/adhywiranata/observact)

> Minimal, Zero-dependencies Reactive Global Store with Observer Pattern

## Install

```npm install observact```


## Basic Usage

```javascript
import {createStore } from 'observact'

const myStore = createStore({
  domains: [
    {key: 'theme', value: 'light'}
  ],
  middlewares: [loggerMiddleware]
})

console.log(myStore.get('theme')) // light

// registers handlers which "listens" to `theme` domain data changes
myStore.observe('theme', (val) => console.log('theme changed! ', val))
myStore.observe('theme', (val) => console.log('woot! this one is the second listener! ', val))

myStore.set('theme', 'dark')

myStore.clearObservers()

myStore.set('theme', 'shade')
console.log(myStore.get('theme')) // shade

```

## Usage with Built-in Logger Middleware

```javascript
import {createStore, loggerMiddleware} from 'observact'

const myStore = createStore({
  domains: [
    {key: 'theme', value: 'light'}
  ],
  middlewares: [loggerMiddleware]
})

myStore.set('theme', 'dark') // will log additional information using the logger middleware
```

## Usage with Custom Middleware

```javascript
import {createStore, createMiddleware} from 'observact'

// custom middleware handler will receive pre-mutation `store` and `incomingMutation` information
const myMiddleware = createMiddleware((store, incomingMutation) => {
  console.log(store.get('theme')) // 'light'
  console.log(incomingMutation.key) // 'theme'
  console.log(incomingMutation.value) // 'dark'
}, 'my-middleware-name')

const myStore = createStore({
  domains: [
    {key: 'theme', value: 'light'}
  ],
  middlewares: [myMiddleware]
})

myStore.set('theme', 'dark') // will log additional information using `myMiddleware`
```