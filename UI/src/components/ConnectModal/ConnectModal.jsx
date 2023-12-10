import './ConnectModal.css'

import { useGlobalContext } from '../../context/global'
import { useSDK } from '@metamask/sdk-react'
import { enqueueSnackbar } from 'notistack'

import xdefiLogo from './../../assets/xdefi.svg'
import metamaskLogo from './../../assets/metamask.png'

const ConnectModal = ({ onClose }) => {
  const { connect } = useGlobalContext()
  const { sdk } = useSDK()

  const connectMetamask = async () => {
    try {
      await sdk?.connect()
    } catch (err) {
      enqueueSnackbar('Failed to connect Metamask', {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom',
        },
        variant: 'error',
      })
    }
  }

  return (
    <div
      className='connect__modal--container'
      onClick={() => {
        onClose()
      }}
    >
      <div
        className='connect__modal--box'
        onClick={async (e) => {
          e.stopPropagation()
          await connect()
          onClose()
        }}
      >
        <img src={xdefiLogo} />
      </div>
      <div
        className='connect__modal--box connect__modal--box-2'
        onClick={async (e) => {
          e.stopPropagation()
          await connectMetamask()
          onClose()
        }}
      >
        <img src={metamaskLogo} />
      </div>
    </div>
  )
}

export default ConnectModal
