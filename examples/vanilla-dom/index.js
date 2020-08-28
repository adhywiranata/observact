import {createStore} from 'observact'

const store = createStore({
  domains: [
    {key: 'theme', value: 'light'}
  ]
})

const body = document.body
const themeDataSelector = document.querySelector('#theme-data')
const toggler = document.querySelector('#toggler')

themeDataSelector.textContent = store.get('theme')

toggler.addEventListener('click', function() {
  if (store.get('theme') === 'light') {
    store.set('theme', 'dark')
  } else {
    store.set('theme', 'light')
  }
})

store.observe('theme', function (newValue) {
  if (newValue === 'dark') {
    toggler.className = 'fa fa-toggle-on'
  } else {
    toggler.className = 'fa fa-toggle-off'
  }
})

store.observe('theme', function (newValue) {
  if (newValue === 'dark') {
    const allLightTexts = document.querySelectorAll('.text-light')
    allLightTexts.forEach(lightText => lightText.className = 'text-dark')
    body.style.backgroundColor = '#333'
  } else {
    const allDarkTexts = document.querySelectorAll('.text-dark')
    allDarkTexts.forEach(lightText => lightText.className = 'text-light')
    body.style.backgroundColor = '#FFF'
  }
})

store.observe('theme', function (newValue) {
  themeDataSelector.textContent = newValue
})