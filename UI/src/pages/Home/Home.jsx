import './Home.css'
import { useGlobalContext } from './../../context/global'
import { Link } from 'react-router-dom'

const Home = () => {
  const { walletAddress } = useGlobalContext()

  return (
    <div className='home__container'>
      {walletAddress ? (
        <div className='home__container--main'>
          <div className='modal-box text-center'>
            <button className='btn btn-active btn-primary mr-5'>Mint</button>
            <Link to='/plugin'>
              <button className='btn btn-active btn-primary'>Plugin</button>
            </Link>
          </div>
        </div>
      ) : (
        <div className='home__container--main'>
          <div className='modal-box text-center'>
            <p className='text-2xl'>Please Connect Wallet to Get Started</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
