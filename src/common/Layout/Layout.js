import { useState } from 'react'
import { useSelector } from 'react-redux'
import Loader from '../../components/Loader'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import logo from '../../assets/images/logo.png'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  const [active, setActive] = useState('Home')

  const navItems = [
    {
      title: 'Home',
      icon: logo,
      onClick: () => {
        setActive('Home')
      },
      isActive: active === 'Home',
    },
    {
      title: 'Notifications',
      icon: logo,
      onClick: () => {
        setActive('Notifications')
      },
      isActive: active === 'Notifications',
      badgeContent: '5',
    },
    {
      title: 'Profile',
      icon: logo,
      onClick: () => {
        setActive('Profile')
      },
      isActive: active === 'Profile',
    },
  ]

  const showLoader = useSelector((state) => state.common.showLoader)
  return (
    <>
      {showLoader ? <Loader /> : null}
      <Header
        brand={<img src={logo} style={{ height: '30px' }} alt='brand logo' className='logo-filter' />}
        className={{ navLink: 'icon-filter' }}
        navItems={navItems}
        position='sticky-top'
      />
      <Outlet />
      <Footer>
        <div className='footer-title'>
          <p>Powered By</p>
          <img src={logo} alt='footer' />
        </div>
        <div className='footer-trademark'>
          <p>Footer text</p>
        </div>
        <div className='footer-copyright'>
          <p>
            Copyright &copy; {new Date().getFullYear() - 1}- {new Date().getFullYear()}
          </p>
        </div>
      </Footer>
    </>
  )
}

export default Layout
