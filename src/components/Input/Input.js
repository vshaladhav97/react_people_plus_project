import React, { useState, useEffect } from 'react'
import './Input.scss'

/**
 * Provides a Input component.
 *
 * @component
 * @example
 * const [value, setValue] = useState('')
 * return (
 *   <Input
 *     value={value}
 *     setValue={(e) => setValue(e.target.value)}
 *     label={'Mobile Number'}
 *     labelAlign='top'
 *     placeholder='Enter Mobile Number'
 *     maxLength={10}
 *     inputType='tel'
 *     isDisabled
 *    />
 * )
 *
 * @property {String} value Current input value
 * @property {Function} handleOnChange Function to handle the onChange event of the input
 * @property {String} id ID of the input
 * @property {String} placeholder Placeholder of the input
 * @property {String} inputType Type of the input
 * @property {Boolean} isDisabled Boolean value, would disable the input if true
 * @property {Object} className An Object, which can be used to add additional classes
 * @property {String} label Label for the input
 * @property {String} labelAlign Decides if the label is on the top or on the left of the <input />
 * @property {String} labelWidth CSS property value that decides the width of the label
 * @property {Object} message Object containing message value and message type
 * @property {Object} otherProps Object containing aditional props.
 * @property {String} inputComponent can be 'textarea' or 'input'. defaults to 'input'.
 */

const Input = ({
  value,
  handleOnChange,
  id,
  placeholder = '',
  inputType = 'text',
  isDisabled = false,
  label,
  labelAlign = 'top',
  labelWidth = '20%',
  className = {},
  message = {},
  name,
  maxLength = 524288,
  autoComplete = 'on',
  otherProps,
  children,
  inputComponent: InputComponent = 'input',
  reference,
}) => {
  const [isActive, setIsActive] = useState(!Boolean(value) && !Number.isInteger(value))

  useEffect(() => {
    const isEmpty = !Boolean(value) && !Number.isInteger(value)
    setIsActive(!isEmpty)
  }, [value])

  const handleTextChange = (event) => {
    handleOnChange(event)
    if (event.target.value !== '') {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }
  return (
    <React.Fragment>
      <div className={`form-control--${labelAlign} ${className.formControl || ''}`}>
        {label && (
          <label
            className={`input__label ${className.label || ''} ${labelAlign === 'float' && isActive ? 'active' : ''}`}
            htmlFor={id}
            style={{ width: labelAlign === 'left' ? `${labelWidth}` : 'auto' }}
          >
            {label}
          </label>
        )}
        <div className={`input-container disabled-${isDisabled} ${className.inputContainer || ''}`}>
          {children}
          <InputComponent
            type={inputType}
            className={`input ${className.input || ''} ${labelAlign === 'float' && isActive ? 'input-active' : ''}`}
            name={name}
            id={id}
            placeholder={labelAlign === 'float' ? '' : placeholder}
            value={value}
            onChange={labelAlign === 'float' ? handleTextChange : handleOnChange}
            maxLength={maxLength}
            disabled={isDisabled}
            autoComplete={autoComplete}
            ref={reference}
            {...otherProps}
          />
          {labelAlign === 'float' && (
            <fieldset className={`fieldset ${isActive ? 'border-active' : ''}`}>
              <legend className={`legend ${isActive ? 'label-active' : ''}`}>
                <span>{label}</span>
              </legend>
            </fieldset>
          )}
        </div>
      </div>
      {message.value && (
        <div
          className={`input__message ${className.message || ''} ${message.type || ''}`}
          style={{ marginLeft: labelAlign === 'left' ? labelWidth : 'auto' }}
        >
          {message.value}
        </div>
      )}
    </React.Fragment>
  )
}

export default React.memo(Input)
