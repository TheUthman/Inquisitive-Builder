import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'
import App from './App'
import { ThemeProvider } from './components/ThemeProvider'
import './styles/global.css'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim()

function Root() {
  const app = (
    <BrowserRouter>
      <ThemeProvider>
        <App clerkConfigured={Boolean(clerkPublishableKey)} />
      </ThemeProvider>
    </BrowserRouter>
  )

  return clerkPublishableKey
    ? <ClerkProvider publishableKey={clerkPublishableKey}>{app}</ClerkProvider>
    : app
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
