import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        style: { background: '#282828', color: 'white', border: '1px solid #3e3e3e' },
      }}
    />
    <App />
  </StrictMode>,
)
