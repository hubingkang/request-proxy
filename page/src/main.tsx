import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

window.addEventListener('error', function (e) {
  if (e.message === 'ResizeObserver loop limit exceeded') {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
, document.querySelector('#root'))
