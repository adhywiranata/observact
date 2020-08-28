import {
  MiddlewareHandler,
  StoreMiddleware,
  MiddlewareHandlerArgs,
} from '../types'

/**
 * Creates Store middleware to get or mutate values inside the Store
 * @param fn Function that do the work using the provided store
 * @param name Name of the middleware
 * @returns StoreMiddleware
 */
export function createMiddleware (fn: MiddlewareHandler, name: string): StoreMiddleware {
  return {
    name,
    exec: (arg: MiddlewareHandlerArgs): void => fn(arg),
  }
}