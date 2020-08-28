import React from 'react'
import ReactDOM from 'react-dom'

import {loggerMiddleware} from 'observact'

import ObservactProvider, {useDomain, useMutation} from './ObservableProvider'

const CompUI = () => {
  const domain = useDomain()
  const mutation = useMutation()

  const isLight = domain.get('theme') === 'light'
  return (
    <div>
      <h1>React App Example for Observact</h1>
      <h3>Without Provider Solution</h3>
      <span>theme: {domain.get('theme')}</span>
      <br /><br />
      <button onClick={() => mutation.set('theme', isLight ? 'dark' : 'light')}>toggle theme</button>
    </div>
  )
}

const ShoutboxUI = () => {
  const domain = useDomain()
  const mutation = useMutation()

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.set('shoutbox', domain.get('shoutbox').concat(e.target.elements[0].value))
    e.target.reset()
  }

  return (
    <div>
      <h2>Shout Out Box</h2>
      <div>
        {domain.get('shoutbox').map((s, idx) => (
          <div key={idx} style={{borderBottom: '1px solid #ccc', padding: '10px 0'}}>{s}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" style={{margin: 20}} />
      </form>
      <button onClick={() => mutation.set('shoutbox', [])}>clear</button>
    </div>
  )

}

const App = () => {
  const storeConf = {
    domains: [
      {
        key: 'theme',
        value: 'light',
      },
      {
        key: 'shoutbox',
        value: [],
      }
    ],
    middlewares: [loggerMiddleware]
  }
  return (
    <ObservactProvider storeConfig={storeConf}>
      <CompUI />
      <ShoutboxUI />
    </ObservactProvider>
  )
}

ReactDOM.render(<App />, document.querySelector('#root'))