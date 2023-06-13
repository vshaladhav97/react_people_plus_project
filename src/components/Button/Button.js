import React, { memo, useEffect, useState } from 'react'
import './Button.scss'

/**
 * Represents an Button component
 *
 * @component
 * @example
 * <Button type='button' text='Button Text' />
 * @property {String} text You can either pass text attribute to display the button text or add children to the component.
 * @property {String} type Type of the button.
 * @property {String} classes classNames for the button.
 * @property {String} classLoader classNames for the button loader.
 * @property {String} classContent classNames for the button content.
 * @property {Function} handleOnclick Event handler that handles the button onClick event.
 * @property {Boolean} isLoading Boolean if true shows a loader inside the button.
 * @property {*} children Components to be rendered inside the button.
 * @property {Object} buttonProps Extra props to be added.
 */

const Button = (props) => {
  const {
    text,
    type = 'submit',
    classes = '',
    classContent = '',
    classLoader = '',
    handleOnClick,
    isDisabled = false,
    children,
    reference,
    isLoading,
    isPointRipple = false,
    notBtnRipple = false,
    xCoord,
    yCoord,
    ...buttonProps
  } = props

  const [coords, setCoords] = useState({ x: -1, y: -1 })
  const [isRippling, setIsRippling] = useState(false)

  useEffect(() => {
    if (coords.x !== -1 && coords.y !== -1) {
      setIsRippling(true)
      setTimeout(() => setIsRippling(false), 300)
    } else setIsRippling(false)
    return () => {
      setIsRippling(false)
    }
  }, [coords])

  useEffect(() => {
    if (!isRippling) setCoords({ x: -1, y: -1 })
  }, [isRippling])

  return (
    <button
      type={type}
      className={`button ${classes}`}
      onClick={(e) => {
        const rect = e.target.getBoundingClientRect()
        setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top })
        handleOnClick && handleOnClick(e)
      }}
      disabled={isDisabled || isLoading}
      ref={reference}
      {...buttonProps}
    >
      {isRippling &&
        !classes.split(' ').includes('button-link') && (
          <span
            className={` ${isPointRipple ? 'button-point-ripple' : 'button-ripple'} ${
              notBtnRipple ? 'ripple-color' : 'button-ripple-color'
            }`}
            style={{
              left: isPointRipple ? xCoord : coords.x,
              top: isPointRipple ? yCoord : coords.y,
            }}
          />
        )}
      {isLoading && <div className={` button__loader ${classLoader}`} />}
      <div className={`${isLoading ? 'button__content--hidden' : 'button__content'} ${classContent}`}>{text || children}</div>
    </button>
  )
}

export default memo(Button)
