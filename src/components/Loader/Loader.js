import React, { useEffect } from 'react'
import './Loader.scss'

/**
 * Provides a Loader component
 *
 * @component
 * @example
 * <Loader isContentLoader={true} />
 
 * @property {Boolean} isContentLoader specifies the position of the loader, when true position is absolute.
 */

const Loader = ({ isContentLoader = false , loaderText = '' , classes={} }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => (document.body.style.overflow = 'auto')
  }, [])

  return (
    <React.Fragment>
      <div className={`loader ${classes.container || ''}`} style={{ position: isContentLoader ? 'absolute' : 'fixed' }} >
        <div className={`${loaderText ? 'loader-text' : ''} ${classes.loaderText || ''}`}>{loaderText}</div>
      </div>
    </React.Fragment>
  )
}

export default Loader
