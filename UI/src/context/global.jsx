import { createContext, useContext } from 'react'
import { useState } from 'react'
import { enqueueSnackbar } from 'notistack'

export const GlobalContext = createContext(null)

export function GlobalProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState('')

  const connect = async () => {
    try {
      const wallet = window?.xfi
      if (!wallet) {
        enqueueSnackbar(
          'XDEFI Wallet Not Found. Please Install from xdefi.io',
          {
            anchorOrigin: {
              horizontal: 'right',
              vertical: 'bottom',
            },
            variant: 'error',
          }
        )
        return
      }

      const account = (await wallet?.bitcoin?.getAccounts())?.[0]
      if (!account) {
        enqueueSnackbar('No account found', {
          anchorOrigin: {
            horizontal: 'right',
            vertical: 'bottom',
          },
          variant: 'error',
        })
        return
      }

      setWalletAddress(account)
      localStorage.setItem('address', account)
    } catch (err) {
      enqueueSnackbar('Failed to connect to XDEFI Wallet', {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom',
        },
        variant: 'error',
      })
    }
  }

  const disconnect = () => {
    setWalletAddress('')
    localStorage.clear()
  }

  return (
    <GlobalContext.Provider
      value={{ walletAddress, setWalletAddress, connect, disconnect }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export function useGlobalContext() {
  const globalContextValue = useContext(GlobalContext)
  if (!globalContextValue) {
    throw new Error('useContext used outside of Provider')
  }

  return globalContextValue
}
