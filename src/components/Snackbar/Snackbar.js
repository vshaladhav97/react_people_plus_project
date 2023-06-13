import React, { useRef, useEffect } from 'react'
import Button from '../Button'
import './Snackbar.scss'
/**
 * Represents a Snackbar component
 * 
 * @component
 * @example
 * <Snackbar
      type='success'
      message='This is a message'
      callback={() => {}}
   />
 */
const Snackbar = ({ type, message, callback, reference, imagePath = '' }) => {
  const snackbarFunction = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    snackbarFunction.current = setTimeout(() => {
      callback()
    }, 3000)
    return () => {
      clearTimeout(snackbarFunction.current)
    }
  }, [callback])

  return (
    <div id='snackbar' className={type} ref={reference}>
      <img className='snackbar--icon' src={imagePath} alt={type} />
      <span className='snackbar--message'>{message}</span>
      <Button
        type='button'
        classes='snackbar--close '
        isPointRipple={true}
        notBtnRipple={true}
        xCoord={0}
        yCoord={3}
        handleOnClick={callback}
      >
        &times;
      </Button>
    </div>
  )
}

export default Snackbar
