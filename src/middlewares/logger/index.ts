import {createMiddleware} from '../../index'

const loggerMiddleware = createMiddleware(({store, incomingMutation}) => {
  const domainKeyToInspect = incomingMutation.key
  console.log(`CURRENT STATE OF \`${domainKeyToInspect}\`=> ${store.get(domainKeyToInspect)}`)
  console.log(`INCOMING STATE OF \`${domainKeyToInspect}\`=> ${incomingMutation.value}`)
}, 'logstore')

export default loggerMiddleware