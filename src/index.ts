import { createMiddleware, loggerMiddleware } from './middlewares'

import { createStore } from './store'

export {
  // factory functions
  createStore,
  createMiddleware,
  // built-in middlewares
  loggerMiddleware,
}