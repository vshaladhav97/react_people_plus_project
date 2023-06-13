import React from 'react'
import './Footer.scss'

/**
 * Represents a Footer component
 * 
 * @component
 * @example
 * <Footer className={{ footerContainer: 'footer__container-class' }} >
 *    <div className='footer-trademark'>
          <p>Servify is a registered Trademark of Service Lee Technologies Private Limited</p>
      </div>
   </Footer>
 */

const Footer = ({ className = {}, children, isSticky = false, reference }) => {
  return (
    <div className={`footer__container sticky-${isSticky} ${className?.footerContainer || ''}`} ref={reference}>
      {children}
    </div>
  )
}

export default React.memo(Footer)
