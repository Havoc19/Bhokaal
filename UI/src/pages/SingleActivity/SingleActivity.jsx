import './SingleActivity.css'
import { useParams } from 'react-router-dom'

const SingleActivity = () => {
  const { id } = useParams()

  return (
    <div className='single__activity--container'>
      {id === '1' && (
        <h1 className='single__activity__header'>Stable Intent Reward</h1>
      )}
      {id === '2' && (
        <h1 className='single__activity__header'>High Risk Leveraged Reward</h1>
      )}
      <div className='flex '>
        <button className='btn btn-primary'>Withdraw</button>
      </div>
    </div>
  )
}

export default SingleActivity
