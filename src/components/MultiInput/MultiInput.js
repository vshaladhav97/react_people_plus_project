import React, { useEffect, useRef, useState } from 'react'
import './MultiInput.scss'
/**
 * Renders a Multi Input component
 *
 * @component
 * @example
 * <MultiInput handleOnChange={handleOnMultiOTPChange} length={6} message={{ value: 'Some msg', type: 'success' }} />
 *
 */

const MultiInput = (props) => {
  const { isDisabled, handleOnChange, length = 6, message, classNames = {}, ...otherProps } = props
  const mInputs = useRef([])
  const [pastedVal, setPastedVal] = useState()
  const [pastedIndex, setPastedIndex] = useState()

  const maxLengthCheck = (object) => {
    if (object.target.value.length > 1) {
      object.target.value = object.target.value.slice(1, 2)
    }
  }
  const onChangeHandler = (e) => {
    e.preventDefault()
    setPastedIndex(null)
    let trimmedValue = ''
    for (let i = 0; i < length; ++i) {
      trimmedValue = trimmedValue + mInputs.current[i].value.trim()
    }
    handleOnChange(trimmedValue)
  }

  const onKeyUpEvent = (index, event) => {
    const eventCode = event.keyCode
    if (
      index !== length - 1 &&
      ((eventCode >= 48 && eventCode <= 57) || (eventCode >= 96 && eventCode <= 105) || eventCode === 39) &&
      !isNaN(parseInt(mInputs.current[index].value))
    ) {
      mInputs.current[index + 1].focus()
    }
    if (index !== 0 && (eventCode === 8 || eventCode === 37)) {
      mInputs.current[index - 1].focus()
    }
  }

  const onKeyDownEvent = (index, event) => {
    const eventCode = event.keyCode
    if (
      (eventCode >= 106 && eventCode <= 222) ||
      eventCode === 69 ||
      (index === 0 && eventCode === 37) ||
      (index === length - 1 && eventCode === 39)
    ) {
      event.preventDefault()
      return false
    }
  }

  const onPasteHandler = (index, e) => {
    let val = e.clipboardData.getData('Text')
    if (index === pastedIndex && val === pastedVal) {
      e.preventDefault()
      return false
    }
    setPastedVal(val)
    setPastedIndex(index)
  }

  useEffect(() => {
    if (pastedVal) {
      let _length = pastedVal.length > 6 ? 6 : pastedVal.length
      let _focusIndex = 0
      for (let x = 0; x < _length; x++) {
        if (mInputs.current[pastedIndex + x]) {
          mInputs.current[pastedIndex + x].value = pastedVal[x]
          _focusIndex = pastedIndex + x
        }
      }
      if (_focusIndex + 1 < 6) {
        mInputs.current[_focusIndex + 1].focus()
      } else {
        mInputs.current[_focusIndex].focus()
      }
      let trimmedValue = ''
      for (let i = 0; i < length; ++i) {
        trimmedValue = trimmedValue + mInputs.current[i].value.trim()
      }
      handleOnChange(trimmedValue)
    }
  }, [pastedVal, pastedIndex, handleOnChange, length])

  const handleFocus = (event) => {
    event.target.select()
  }

  return (
    <React.Fragment>
      {[...Array(length).keys()].map((item, index) => {
        return (
          <input
            type='number'
            className={`multi-input codeBox${index} ${classNames.input || ''}`}
            onKeyUp={(event) => {
              onKeyUpEvent(index, event)
            }}
            onKeyDown={(event) => {
              onKeyDownEvent(index, event)
            }}
            onChange={onChangeHandler}
            onInput={maxLengthCheck}
            disabled={isDisabled}
            key={'mli' + index}
            onPaste={(e) => onPasteHandler(index, e)}
            onFocus={(e) => handleFocus(e, index)}
            autoFocus={index === 0 ? true : false}
            {...otherProps}
            ref={(node) => (mInputs.current[index] = node)}
          />
        )
      })}
      {message && message.type && <div className={`multi-input__message ${message.type} ${classNames.message || ''}`}>{message.value}</div>}
    </React.Fragment>
  )
}
export default MultiInput
