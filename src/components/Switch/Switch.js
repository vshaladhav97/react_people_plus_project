import React, { useEffect, useState } from 'react'
import './Switch.scss'

/**
 * Represents a Switch component
 *
 * @component
 * @example
 * <Switch
 *    id = 'switch'
 *    checked = {switchState}
 *    onChange={setSwitchState}
 *  >
 *    Switch
 * </Switch>
 *
 * @property {String} id ID of the switch, defaults to switch.
 * @property {Boolean} checked Current value of the switch.
 * @property {Boolean} disabled Disables the switch component.
 * @property {String} className Which can used to attach custom className to the Switch.
 * @property {Function} onChange A function, for onChange event.
 * @property {Object} otherProps An object, which can be used to pass additional attributes, event handlers for the input.
 * @property {*} children An element or a component could be passed to render.
 */

const Switch = ({ id = 'switch', checked = false, onChange, disabled = false, children, className = {}, otherProps = {} }) => {
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
    <div className={`toggle-switch ${className?.switchContainer || ''}`}>
      <input
        type='checkbox'
        className={`toggle-switch-checkbox ${className?.switchCheckbox || ''}`}
        id={id}
        checked={checked}
        onClick={(e) => {
          const rect = e.target.nextSibling.getBoundingClientRect()
          setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top })
        }}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
        {...otherProps}
      />
      <label className={`toggle-switch-label ${className?.switchLabel || ''}`} htmlFor={id}>
        <span className={`toggle-switch-inner ${disabled ? 'toggle-switch-disabled' : ''}`} />
        <span className={`toggle-switch-icon ${disabled ? 'toggle-switch-disabled' : ''}`}>
          {isRippling && <span className='switch-ripple' />}
        </span>
      </label>
      {children}
    </div>
  )
}

export default Switch
