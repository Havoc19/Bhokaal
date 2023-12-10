import Navbar from '../components/Navbar/Navbar'

const Layout = ({ children }) => {
  console.log(children)
  return (
    <div className='layout__container'>
      <Navbar />
      {children}
    </div>
  )
}

export default Layout
