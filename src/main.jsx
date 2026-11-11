import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'dockview-react/dist/styles/dockview.css'
import './index.css'
import App from './App.jsx'

// DEV TESTING

import { buildMatrices } from './core/analysis/matrices';
import { usePetriStore } from './store/usePetriStore';

if (import.meta.env.DEV) {
    window.debug = { buildMatrices, store: usePetriStore };
}

// ===========

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
