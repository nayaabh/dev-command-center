import React from 'react'
import { render } from 'react-dom'
import { App } from './app'
import index from './index.less'

window.React = React

render(
    <App />,
    document.getElementById('devCenter')
)