import './Navbar.css'
import { useEffect, useState } from 'react'

import ConnectModal from '../ConnectModal/ConnectModal'

import { useGlobalContext } from '../../context/global'
import { useSDK } from '@metamask/sdk-react'
import { Link } from 'react-router-dom'

import { fetchGasData } from './../../helpers/getGasData'

export function formatAddress(address) {
  return `${address?.substring(0, 5)}...${address?.substring(
    address?.length - 4,
    address?.length
  )}`
}

const Navbar = () => {
  const [showModal, setShowModal] = useState(false)
  const [estimatedBaseFee, setEstimatedBaseFee] = useState(0)
  const [networkCongestion, setNetworkCongestion] = useState(0)

  const { walletAddress, disconnect } = useGlobalContext()
  const { account, chainId } = useSDK()

  const disconnectMetamask = () => {
    localStorage.clear()
    location.reload()
  }

  useEffect(() => {
    async function helper() {
      const res = await fetchGasData()

      setEstimatedBaseFee(res.estimatedBaseFee)
      setNetworkCongestion(res.networkCongestion)
    }
    helper()
  }, [])

  return (
    <>
      {showModal && <ConnectModal onClose={() => setShowModal(false)} />}
      <header>
        <nav className='navbar__container'>
          <h1 className='navbar__container--h1'>
            <Link to='/'>
              <span>Bhoo</span>kaal
            </Link>
          </h1>
          {walletAddress ? (
            <>
              <div className='badge badge-accent'>ETH Fees</div>
              <div className='badge badge-secondary'>
                EstimatedBaseFee : {estimatedBaseFee}
              </div>
              <div className='badge badge-primary'>
                NetworkCongestion : {networkCongestion}
              </div>
            </>
          ) : account ? (
            <>
              <div className='badge badge-accent'>ETH Fees</div>
              <div className='badge badge-secondary'>
                EstimatedBaseFee : {estimatedBaseFee}
              </div>
              <div className='badge badge-primary'>
                NetworkCongestion : {networkCongestion}
              </div>
            </>
          ) : null}
          {walletAddress ? (
            <button className='btn btn-active btn-primary' onClick={disconnect}>
              Disconnect
              <div className='badge badge-ghost'>
                {formatAddress(walletAddress)}
              </div>
            </button>
          ) : account ? (
            <button
              className='btn btn-active btn-primary'
              onClick={disconnectMetamask}
            >
              Disconnect
              <div className='badge badge-ghost'>{formatAddress(account)}</div>
            </button>
          ) : (
            <button
              className='btn btn-active btn-primary'
              onClick={() => setShowModal(true)}
            >
              Connect
            </button>
          )}
        </nav>
      </header>
    </>
  )
}

export default Navbar
