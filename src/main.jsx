import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import Home from './Home.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <Home />
    </BrowserRouter>
)
