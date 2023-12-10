import './Activity.css'
import { Link } from 'react-router-dom'

const Activity = () => {
  return (
    <div className='activity__container'>
      <h1 className='activity__header'>Plugin</h1>
      <div className='flex '>
        <>
          <div className='card w-96 bg-base-100 shadow-xl'>
            <div className='card-body'>
              <h2 className='card-title set_to_center'>Stable Intent Reward</h2>
              <div className='card-actions justify-center'>
                <Link to='/activity/1'>
                  <button className='btn btn-primary mt-5'>
                    Connect Network
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </>
        <>
          <div className='card w-96 bg-base-100 shadow-xl'>
            <div className='card-body'>
              <h2 className='card-title set_to_center'>
                High Risk Leveraged Reward
              </h2>
              <div className='card-actions justify-center'>
                <Link to='/activity/1'>
                  <button className='btn btn-primary mt-5'>
                    Connect Network
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  )
}

export default Activity
