import React, { useState, useEffect } from 'react'
import Button from '../../components/Button'
import './Header.scss'

/**
 * Provides a Header component
 *
 * @component
 * @example
 * <Header
    brand={<img src={logo} style={{ height: '30px' }} alt='brand logo' />}
    navItems={navItems}
    className={{ header: 'my-header' }}
   />
 *
 * @property {*} brand A component to display the brand identity. It can be an image, text, or a component.
 * @property {Array} navItems is a list of navigation links and their configuration to be displayed on the navbar.
 * @property {Array} superNavItems contanining a list of navigation links to be displayed on top of the main navbar.
 * @property {String} position String which specifies the position of the header. values can be 'fixed-top', 'fixed-bottom', 'sticky-top', 'sticky-bottom'.
 * @property {Object} className An object which can be used to add additional classes.
 * @property {*} children Custom child components can be passed in and can be positioned using
 * @property {Object} otherProps An object, which can be used to pass additional props.
 */

const Header = ({
  brand,
  navItems = [],
  className = {},
  children,
  superNavItems = [],
  position = 'static',
  otherProps = {},
  reference,
  iconType = 'img',
}) => {
  const [navStatus, setNavStatus] = useState('hidden')
  const [activeLink, setActiveLink] = useState('')

  const toggleNav = () => {
    if (navStatus === 'hidden') {
      document.body.style.overflowY = 'hidden'
      setNavStatus('visible')
    } else {
      document.body.style.overflowY = 'auto'
      setNavStatus('hidden')
    }
  }

  useEffect(() => {
    navItems.length > 0 && setActiveLink(navItems.find((item) => item.isActive)?.title)
  }, [navItems])

  useEffect(() => {
    return () => {
      document.body.style.overflowY = 'auto'
    }
  }, [])

  return (
    <header className={`header header--${position} ${className.header || ''}`} {...otherProps} ref={reference}>
      {brand && brand}
      {navItems.length > 0 && (
        <nav className={`header__nav header__nav--${navStatus} ${className.nav || ''}`}>
          <ul className='header__ul'>
            {navItems.map((item, index) => {
              return (
                !item.hidden &&
                (!item.buttonElement ? (
                  <li key={index} className={`header__li ${className.navItem || ''}`}>
                    {item.badgeContent && <span className='nav__badge'>{item.badgeContent}</span>}
                    {React.isValidElement(item.component) ? (
                      <button type='button' className={`header__button ${className.navLink || ''}`}>
                        {item.component}
                      </button>
                    ) : (
                      <button
                        type='button'
                        onClick={() => {
                          item.onClick()
                          setNavStatus('hidden')
                        }}
                        className={`header__button ${className.navLink || ''} ${item.isActive ? 'active' : ''}`}
                      >
                        {iconType === 'svg' ? (
                          <span className='mr10'>{item.icon}</span>
                        ) : (
                          item.icon && <img src={item.icon} className='header__nav-icon' alt={item.title} />
                        )}
                        {item.title && item.title}
                      </button>
                    )}
                  </li>
                ) : (
                  <li key={index} className='header__li'>
                    <Button
                      type='button'
                      text={item.title}
                      classes={`header__button-padding mt10 ${item.classes}`}
                      handleOnClick={() => {
                        item.onClick()
                        setNavStatus('hidden')
                      }}
                    />
                  </li>
                ))
              )
            })}
          </ul>
        </nav>
      )}
      {navItems.length > 0 && (
        <button type='button' className='header__hamburger' onClick={toggleNav}>
          {activeLink}
          <span>{'\u2630'}</span>
        </button>
      )}
      {superNavItems.length > 0 && (
        <div className='header__super-nav'>
          {superNavItems.map((item, index) => (
            <button type='button' key={index} onClick={item.onClick} className={`header__super-button ${item.isActive ? 'active' : ''}`}>
              {item.title}
            </button>
          ))}
        </div>
      )}
      {children}
    </header>
  )
}

export default React.memo(Header)
