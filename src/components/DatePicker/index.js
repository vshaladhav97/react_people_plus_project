import React, { useState, useEffect, useRef } from 'react'
import './DatePicker.scss'
import Calendar from './Calendar'
import Button from '../Button'
import { dateFormats, formatDate, ISOFormat, isBefore } from './helpers'
import { checkIfDateObject } from '../../utils/helpers'

/**
 * Provides a DatePicker component
 *
 * @component
 * @example
 * <DatePicker
    date={new Date()}
    handleOnChange={handleOnChange}
    maxDay={new Date('2021/1/3')}
    minDay={new Date('2020/9/26')}
   />
 *
 * @property {Object} date A JavaScript Date object, if not passed, the default value would be today's date.
 * @property {String} placeholder Placeholder for input element.
 * @property {String} label Label for input element.
 * @property {Boolean} floatingLabel A boolean value indicating whether floating label is enabled.
 * @property {Function} handleOnChange An onChange handler, to receive back the Date object.
 * @property {Object} minDay The minimum date parameter, should be a JavaScript Date object.
 * @property {Object} maxDay The maximum date parameter, should be a JavaScript Date object.
 * @property {Boolean} isInputDisabled Value to disable the input value, and only get values from the Calendar.
 * @property {Boolean} isDisabled Value to disable the datePicker.
 * @property {String} format A regular expression for date, if not specified, would default to mm/dd/yyyy. 
 * Can be one of these four mm/dd/yyyy , dd/mm/yyyy , dd-mm-yyyy , yyyy-mm-dd, dd/mm/yy.
 * @property {Object} config An object which takes in 3 parameters, format, regular expression, and separator.
 * @property {Boolean} showFilterBtn A boolean, if passed as true, will display a Filter Button.
 * @property {Function} onFilterBtnClick An event listener which gets fired when the Filter button is clicked.
 * @property {Object} classes An object to pass custom classes to different elements of the date picker.
 * @property {*} children An element or a component could be passed to render.
 */

const DatePicker = (props) => {
  const {
    showFilterBtn = false,
    onFilterBtnClick,
    date,
    config,
    format,
    isInputDisabled,
    isDisabled = false,
    handleOnChange,
    maxDay,
    minDay,
    placeholder,
    children,
    showDateRange = false,
    dateRange = {},
    classes = {},
    floatingLabel = false,
    label = 'Enter Date',
  } = props
  const [isActive, setIsActive] = useState(Boolean(date))

  const [value, setValue] = useState(date)

  const [isStartDate, setIsStartDate] = useState(true)

  const [showCalendar, setShowCalendar] = useState(false)

  const [dateValue, setDateValue] = useState(date)

  const dateContainer = useRef(null)
  const input = useRef(null)
  const calenderRef = useRef(null)
  const handleOutsideClick = (e) => {
    if (dateContainer.current && !dateContainer.current.contains(e.target)) {
      setShowCalendar(false)
      setIsActive(Boolean(input.current.value))
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  useEffect(() => {
    setValue(date)
    setDateValue(date)
  }, [date])

  const handleOnClick = () => {
    setShowCalendar(true)
    setIsActive(true)
  }

  const handleOnFilterBtnClick = () => {
    setShowCalendar(false)
    onFilterBtnClick()
  }

  const setConfig = () => {
    let currentFormat, regex, separator
    if (config) {
      currentFormat = config.format || 'mm/dd/yyyy'
      regex = config.regex || dateFormats[currentFormat].regex
      separator = config.separator || '/'
    } else {
      currentFormat = dateFormats[format] ? format : 'mm/dd/yyyy'
      regex = dateFormats[currentFormat].regex
      separator = dateFormats[currentFormat].separator
    }
    return { currentFormat, regex, separator }
  }

  const handleOnInputChange = (e) => {
    setValue(e.target.value)
    const { currentFormat, regex, separator } = setConfig()
    const minDayPresent = checkIfDateObject(minDay)
    const maxDayPresent = checkIfDateObject(maxDay)
    let date = new Date(ISOFormat(e.target.value, currentFormat, separator))
    if (
      !regex.test(e.target.value) ||
      (maxDayPresent && date.getTime() > maxDay.getTime()) ||
      (minDayPresent && date.getTime() < minDay.getTime())
    ) {
      handleOnChange(false)
    } else {
      const splitFormat = currentFormat.split(separator)
      const yearFormat = currentFormat && splitFormat.find((formatItem) => formatItem.includes('y'))
      if (yearFormat.length === 2) {
        const splitDate = e.target.value.split(separator)
        const year = splitDate[splitFormat.indexOf(yearFormat)]
        splitDate[splitFormat.indexOf(yearFormat)] = new Date().getFullYear().toString().slice(0, 2) + year
        date = new Date(ISOFormat(splitDate.join(separator), currentFormat, separator))
      }
      handleOnChange(date)
      setDateValue(date)
    }
  }

  const changeInputRangeValue = (date) => {
    if (isStartDate) {
      handleOnChange({
        startDate: date,
        endDate: date,
      })
    } else {
      if (isBefore(date, dateRange.startDate)) {
        handleOnChange({
          startDate: date,
          endDate: dateRange.startDate,
        })
      } else {
        handleOnChange({
          ...dateRange,
          endDate: date,
        })
      }
    }
    setIsStartDate(!isStartDate)
  }

  const changeInputValue = (date, nextOrPrevious = false) => {
    setValue(date)
    setShowCalendar(nextOrPrevious)
    !nextOrPrevious && input.current.focus()
  }

  const onFormat = (date) => {
    const { currentFormat, regex, separator } = setConfig()
    const splitDate = date.toString().split(' ')
    const formattedDate = formatDate(splitDate, currentFormat, separator)
    if (regex.test(formattedDate)) {
      return formattedDate
    }
    return date
  }
  useEffect(() => {
    if (showCalendar) {
      setTimeout(() => {
        const scrollableSpaceAtTop = Math.floor(window.scrollY)
        const totalPageHeight = document.documentElement.offsetHeight
        const screenHeight = window.screen.availHeight
        const availableSpaceAtTop = dateContainer.current.getBoundingClientRect().top
        const availableSpaceAtBottom = screenHeight - dateContainer.current.getBoundingClientRect().bottom
        const scrollableAtBottom = totalPageHeight - window.screen.availHeight - Math.floor(window.scrollY)
        const heightOfDropDown = calenderRef?.current?.clientHeight
        const halfOfCalendarHeight = (heightOfDropDown - dateContainer.current.style.height) / 2

        const conditions = { //start reading the conditions from end
          ['true']: 'above',  //if not enough space available in the screen and the page is not scrollable
          [availableSpaceAtTop + scrollableSpaceAtTop >= heightOfDropDown]: 'top',  // page is scrollable at top
          [availableSpaceAtBottom + scrollableAtBottom >= heightOfDropDown]: 'bottom', //page is scrollable at bottom
          [availableSpaceAtBottom < availableSpaceAtTop && availableSpaceAtTop + scrollableSpaceAtTop >= heightOfDropDown]: 'top', //space at top is more than space  at bottom and the page is scrollable at top
          [availableSpaceAtBottom > availableSpaceAtTop && availableSpaceAtBottom + scrollableAtBottom >= heightOfDropDown]: 'bottom', //space at bottom is more than space at top and the page is scrollable at bottom.
          [availableSpaceAtTop >= heightOfDropDown]: 'top', //enough space is there on the screen at the top
          [availableSpaceAtBottom >= heightOfDropDown]: 'bottom', //enough space is there on the screen at the bottom
        }
        calenderRef.current.classList.add(`open-${conditions['true']}`)
        if (conditions['true'] === 'above') {
          if (halfOfCalendarHeight <= availableSpaceAtBottom && halfOfCalendarHeight <= availableSpaceAtTop) {
            calenderRef.current.style.bottom = `-${halfOfCalendarHeight}px`
          } else if (availableSpaceAtBottom < availableSpaceAtTop) {
            calenderRef.current.style.bottom = `-${availableSpaceAtBottom}px`
          } else {
            calenderRef.current.style.top = `-${availableSpaceAtTop}px`
          }
        }
      }, 1)
    }
  })
  return (
    <div className={`form ${classes.container || ''}`} id='date-picker' ref={dateContainer}>
      <input
        type='text'
        ref={input}
        aria-label='date-picker'
        className={`form__input ${!showCalendar && isDisabled ? 'date-picker-disabled' : 'border-bottom-1'} ${classes.input || ''}`}
        value={
          showDateRange
            ? checkIfDateObject(dateRange.startDate) && checkIfDateObject(dateRange.endDate)
              ? onFormat(dateRange.startDate) + ' to ' + onFormat(dateRange.endDate)
              : ''
            : onFormat(value)
        }
        placeholder={isActive ? placeholder : label}
        onChange={handleOnInputChange}
        onClick={handleOnClick}
        readOnly={showDateRange || isInputDisabled}
        disabled={isDisabled}
        onKeyPress={(e) => {
          e.key === 'Enter' && handleOnClick()
        }}
      />
      {floatingLabel && (
        <fieldset className={`fieldset ${isActive ? 'border-active' : ''}`}>
          <legend className={`legend ${isActive ? 'label-active' : ''}`}>
            <span>{label}</span>
          </legend>
        </fieldset>
      )}

      {!isDisabled && dateRange.startDate && showFilterBtn && (
        <Button type='button' handleOnClick={handleOnFilterBtnClick} classes={'filter-button'} text='Filter' />
      )}
      {children}
      {showCalendar && (
        <Calendar
          {...props}
          ref={calenderRef}
          date={dateValue}
          changeInputValue={showDateRange ? changeInputRangeValue : changeInputValue}
        />
      )}
    </div>
  )
}

export default React.memo(DatePicker)
