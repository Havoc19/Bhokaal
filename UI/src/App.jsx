import './App.css'
import { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import { useGlobalContext } from './context/global'

import Layout from './layout/Layout'

import Home from './pages/Home/Home'
import Activity from './pages/Activity/Activity'
import SingleActivity from './pages/SingleActivity/SingleActivity'

function App() {
  const { walletAddress, setWalletAddress } = useGlobalContext()
  const history = useNavigate()

  useEffect(() => {
    const address = localStorage.getItem('address')
    if (address) {
      setWalletAddress(address)
    }
  }, [])

  useEffect(() => {
    if (!walletAddress) {
      history('/')
    }
  }, [walletAddress])

  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/plugin' element={<Activity />} />
        <Route path='/activity/:id' element={<SingleActivity />} />
      </Routes>
    </Layout>
  )
}

export default App
