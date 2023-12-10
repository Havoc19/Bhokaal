import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GlobalProvider } from './context/global.jsx'
import { SnackbarProvider } from 'notistack'
import { HashRouter } from 'react-router-dom'
import { MetaMaskProvider } from '@metamask/sdk-react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SnackbarProvider />
    <GlobalProvider>
      <HashRouter>
        <MetaMaskProvider
          debug={false}
          sdkOptions={{
            checkInstallationImmediately: false,
            dappMetadata: {
              name: 'Bhookaal App',
              url: window.location.host,
            },
          }}
        >
          <App />
        </MetaMaskProvider>
      </HashRouter>
    </GlobalProvider>
  </React.StrictMode>
)
