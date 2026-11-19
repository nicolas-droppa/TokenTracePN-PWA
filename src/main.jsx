import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'dockview-react/dist/styles/dockview.css'
import './index.css'
import App from './App.jsx'
import i18n from './i18n';

// DEV TESTING

import { buildMatrices } from './core/analysis/matrices';
import { cellCommand } from './core/matrixEdits';
import { usePetriStore } from './store/usePetriStore';

if (import.meta.env.DEV) {
    window.debug = { buildMatrices, cellCommand, store: usePetriStore, i18n };
}

// ===========

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
