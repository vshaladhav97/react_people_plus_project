import React, { useEffect, useState } from 'react'
import './Radio.scss'

/**
 * Provides a Radio component
 *
 * @component
 * @example
 * <Radio
    value='value1'
    selectedValue={selectedValue}
    tname='customName'
    classes='customClasses'
    handleOnUpdate={(e) => setSelectedValue(e.target.value)}
    >
      Option 1
    </Radio>
 *
 * @property {String} value Value of the radio selection (required).
 * @property {String} name Name of radio input fields (required).
 * @property {String} selectedValue Selected value (required).
 * @property {Function} handleOnUpdate An onChange handler, to receive back the selected element's object.
 * @property {String} classes Add new classes to the radio button (optional).
 * @property {String} id A unique id for the Radio, defaults to radio.
 * @property {Boolean} isDisabled A boolean value to specify if the radio option needs to be disabled (optional).
 * @property {String} radioType This can either be tabs or radio, if nothing passed, the default value will radio. (optional).
 * @property {String} inputClasses Add new classes to the radio input (optional).
 * @property {String} labelClasses Add new classes to the inner label span (optional).
 * @property {Object} inputProps Any number of extra/custom props can be passed to the input box(optional).
 */

const Radio = (props) => {
  const {
    classes = '',
    name = 'radio-group',
    value,
    handleOnUpdate,
    radioType = '',
    selectedValue,
    isDisabled = false,
    children,
    id = `${name}__${value}`,
    inputClasses = '',
    labelClasses = '',
    reference,
    ...inputProps
  } = props

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
    <label className={`radio ${classes} ${radioType} disabled_${+isDisabled}`} aria-label='radio-button' htmlFor={id}>
      <input
        type='radio'
        checked={selectedValue === value}
        disabled={isDisabled}
        value={value}
        name={name}
        onClick={(e) => {
          if (radioType === 'tabs') {
            const rect = e.target.nextSibling.getBoundingClientRect()
            setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top })
          }
        }}
        onChange={(e) => {
          if (radioType !== 'tabs') {
            setCoords({ x: -5, y: -13 })
          }
          handleOnUpdate(e)
        }}
        className={`radio__input ${inputClasses}`}
        id={id}
        ref={reference}
        {...inputProps}
      />
      <span className={`${radioType === 'tabs' ? 'radio__label--tabs ' : 'radio__label '} ${(radioType !== 'tabs' && isRippling) ? 'ripple ' : ''} ${labelClasses}`}>
        {radioType === 'tabs' && isRippling && (
          // <div className='ripple-container'>
            <span
              className={'button-ripple ripple-color'}
              style={{
                left: coords.x,
                top: coords.y,
              }}
            />
          // </div>
        )}
        {children}
      </span>
    </label>
  )
}

export default Radio
