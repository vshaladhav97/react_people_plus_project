import React, { useEffect, useState } from 'react'
import './Checkbox.scss'

/**
 * Represents a Checkbox component
 *
 * @component
 * @example
 * <Checkbox
 *    value={currentValue}
 *    handleOnChange={onChangeFunction}
 *    otherProps={{
 *      onKeyDown={onKeyDownFunction}
 *    }}
 *  >
 *    First Checkbox
 * </Checkbox>
 *
 * @property {String} type Which can either be 'tabs' or 'checkbox', defaults to "checkbox".
 * @property {String} id ID of the checkbox, defaults to checkbox.
 * @property {String} name Name of the checkbox, defaults to checkbox.
 * @property {Boolean} value Current value of the Checkbox.
 * @property {Function} handleOnChange A function, for onChange event. It returns the event.
 * @property {Object} otherProps An object, which can be used to pass additional attributes, event handlers for the input.
 * @property {*} children An element or a component could be passed to render.
 * @property {Object} className An object containing classNames for various elements of Checkbox
 */

const Checkbox = ({
  name = 'checkbox',
  value,
  handleOnChange,
  otherProps = {},
  type = 'checkbox',
  children,
  isDisabled = false,
  id = 'checkbox',
  className = {},
  reference,
}) => {
  const [coords, setCoords] = useState({ x: -1, y: -1 })
  const [isRippling, setIsRippling] = useState(false)

  useEffect(() => {
    if (coords.x !== -1 && coords.y !== -1) {
      setIsRippling(true)
      setTimeout(() => setIsRippling(false), 300)
    } else setIsRippling(false)
  }, [coords])

  useEffect(() => {
    if (!isRippling) setCoords({ x: -1, y: -1 })
  }, [isRippling])

  return (
    <label className={`${type} ${className.container || ''}`} htmlFor={id}>
      {type === 'tabs' && isRippling && (
        <span
          className={'button-ripple ripple-color'}
          style={{
            left: coords.x,
            top: coords.y,
          }}
        />
      )}
      <input
        id={id}
        name={name}
        type='checkbox'
        checked={value}
        onClick={(e) => {
          if (type === 'tabs') {
            const rect = e.target.nextSibling.getBoundingClientRect()
            setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top })
          } else {
            const rect = e.target.parentElement.getBoundingClientRect()
            const rectInner = e.target.getBoundingClientRect()
            setCoords({ x: -5, y: rectInner.top - rect.top - 5 })
          }
        }}
        onChange={(e) => {
          handleOnChange(e)
        }}
        hidden={type === 'tabs'}
        disabled={isDisabled}
        {...otherProps}
        className={`${className.input || ''} ${type !== 'tabs' && isRippling ? 'ripple ' : ''}`}
        ref={reference}
      />
      <span className={`${type === 'tabs' ? 'checkbox__label--tabs' : 'checkbox__label'} ${className.label || ''}`}>{children}</span>
    </label>
  )
}

export default React.memo(Checkbox)
