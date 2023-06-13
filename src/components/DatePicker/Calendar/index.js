import React, { useState, useEffect, useRef, forwardRef } from 'react'
import './Calendar.scss'
import { getDaysOfMonth, getTranslatedMonths, getTranslatedLocaleDays, getLocaleDaySequence, classList, isWithinInterval } from '../helpers'
import Button from '../../Button'
import { checkIfDateObject } from '../../../utils/helpers'
import ArrowEnd from '../../../assets/images/arrow-end-right.svg'

const Calendar = forwardRef((props, ref) => {
  const {
    date,
    minDay,
    maxDay,
    handleOnChange,
    changeInputValue,
    showDateRange,
    dateRange,
    showPreDefinedRange,
    locale,
    calendarFooter,
    lettersInDayName = 1,
    language,
    localeToFirstDayMap,
    focusCalendarInitially = true,
  } = props
  const [months, setMonths] = useState([])
  const [filteredMonths, setFilteredMonths] = useState([])
  const [years, setYears] = useState([])
  const [weekdays, setWeekdays] = useState([])
  const [daysOfMonth, setDaysOfMonth] = useState()
  const [day, setDay] = useState()
  const [month, setMonth] = useState()
  const [year, setYear] = useState()
  const [selectedDay, setSelectedDay] = useState()
  const [minDayPresent, setMinDayPresent] = useState(false)
  const [maxDayPresent, setMaxDayPresent] = useState(false)
  const [showPrevious, setShowPrevious] = useState(true)
  const [showNext, setShowNext] = useState(true)
  const [showMonths, setShowMonths] = useState(false)
  const [showYears, setShowYears] = useState(false)
  const [monthScrollStatus, setMonthScroll] = useState('scrollable')
  const [yearScrollStatus, setYearScroll] = useState('scrollable')

  const [isDayTabbed, setIsDayTabbed] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [focusedDay, setFocusedDay] = useState(() => {
    if (!focusCalendarInitially) return
    if (dateRange) return dateRange?.startDate || new Date().getDate()
    return checkIfDateObject(date) ? date.getDate() : new Date().getDate()
  })

  const currentCell = useRef(null)
  const nextBtn = useRef(null)
  const selectedMonthOption = useRef(null)
  const selectedYearOption = useRef(null)
  const monthDropdown = useRef(null)
  const yearDropdown = useRef(null)
  const monthDropdownWrapper = useRef(null)
  const yearDropdownWrapper = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (monthDropdownWrapper.current && !monthDropdownWrapper.current.contains(e.target)) {
        setShowMonths(false)
      }
      if (yearDropdownWrapper.current && !yearDropdownWrapper.current.contains(e.target)) {
        setShowYears(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const handlePreDefinedRange = (type) => {
    let startDate = new Date()
    let endDate = new Date()
    switch (type) {
      case 'yesterday':
        startDate.setDate(startDate.getDate() - 1)
        endDate.setDate(endDate.getDate() - 1)
        break
      case 'lastSeven':
        startDate.setDate(startDate.getDate() - 6)
        break
      case 'lastThirty':
        startDate.setDate(startDate.getDate() - 29)
        break
      case 'thisMonth':
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
        endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0)
        break
      case 'lastMonth':
        startDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1)
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 0)
        break
      default:
    }

    handleOnChange({ startDate, endDate })
    setDateState(endDate.getMonth(), endDate.getFullYear(), endDate.getDate(), 0)
  }

  const checkDateEnabled = (_type, _year, _month, _date) => {
    let _enabled = true
    if (_type === 'min') {
      if (minDayPresent && new Date(_year, _month, _date).getTime() < minDay.getTime()) {
        _enabled = false
      }
    } else {
      if (maxDayPresent && new Date(_year, _month, _date).getTime() > maxDay.getTime()) {
        _enabled = false
      }
    }
    return _enabled
  }

  useEffect(() => {
    const getFilteredYears = (minimumDay, maximumDay) => {
      let yearList = []
      const minDayPresent = checkIfDateObject(minimumDay)
      const maxDayPresent = checkIfDateObject(maximumDay)

      const currentYear = new Date().getFullYear()

      const minYear = (minDayPresent && minimumDay.getFullYear()) || currentYear - 99
      const maxYear = (maxDayPresent && maxDayPresent.getFullYear()) || currentYear + 100

      for (let i = minYear; i <= maxYear; i++) {
        yearList = [...yearList, i]
      }
      return yearList
    }

    const filteredYears = getFilteredYears(minDay, maxDay)
    setYears(filteredYears)
  }, [language, minDay, maxDay])

  useEffect(() => {
    setWeekdays(getTranslatedLocaleDays(language, locale, localeToFirstDayMap))
  }, [language, locale, localeToFirstDayMap])

  useEffect(() => {
    const minDayPresent = checkIfDateObject(minDay)
    const maxDayPresent = checkIfDateObject(maxDay)
    setMinDayPresent(!!minDayPresent)
    setMaxDayPresent(!!maxDayPresent)
    minDayPresent && setShowPrevious(new Date(year, month, 1).getTime() > minDay.getTime())
    maxDayPresent && setShowNext(new Date(year, month, daysOfMonth).getTime() < maxDay.getTime())
    currentCell.current && isInitialLoad && currentCell.current.focus()
  }, [month, year, daysOfMonth, minDay, maxDay, isInitialLoad])

  useEffect(() => {
    let currentDate = new Date()

    if (checkIfDateObject(date)) {
      currentDate = date
    }
    setDaysOfMonth(getDaysOfMonth(currentDate.getFullYear(), currentDate.getMonth() + 1))
    setDay(new Date(currentDate.getFullYear(), currentDate.getMonth()).getDay())
    setMonth(currentDate.getMonth())
    setYear(currentDate.getFullYear())
    setSelectedDay(currentDate.getDate())
  }, [date])

  useEffect(() => {
    let currentDate = new Date()

    if (checkIfDateObject(date)) {
      currentDate = date
    }

    const translatedMonths = getTranslatedMonths(language)
    const getFilteredMonths = (presentDate, minDay, maxDay) => {
      const minDayPresent = checkIfDateObject(minDay)
      const maxDayPresent = checkIfDateObject(maxDay)

      const maxMonth = maxDayPresent && year === maxDay.getFullYear() && maxDay.getMonth()
      const minMonth = minDayPresent && year === minDay.getFullYear() && minDay.getMonth()

      const filteredMonths = translatedMonths.slice(minMonth || 0, Number.isInteger(maxMonth) ? maxMonth + 1 : translatedMonths.length)
      return filteredMonths
    }
    const filteredMonths = getFilteredMonths(currentDate, minDay, maxDay)

    setFilteredMonths(filteredMonths)
    setMonths(translatedMonths)
  }, [date, month, year, minDay, maxDay, language])

  useEffect(() => {
    handleScroll(monthDropdown.current, setMonthScroll)
  }, [months.length])

  useEffect(() => {
    handleScroll(yearDropdown.current, setYearScroll)
  }, [years.length])

  const handleOnClick = (date) => {
    const newDate = new Date(year, month, date)
    setSelectedDay(date)
    if (!showDateRange) {
      setTimeout(() => {
        changeInputValue && changeInputValue(newDate)
      }, 300)
      handleOnChange(newDate)
    } else {
      changeInputValue && changeInputValue(newDate)
      setFocusedDay(date)
    }
  }

  const setDateState = (month, year, type, count) => {
    setIsInitialLoad(false)
    let date
    if (month !== new Date(year, month, selectedDay).getMonth()) {
      date = new Date(year, month, getDaysOfMonth(year, month + 1))
    } else {
      date = new Date(year, month, selectedDay)
    }
    let daysOfMonth = getDaysOfMonth(year, month + 1)
    let _day = date.getDate()
    let _date = date
    if (!checkDateEnabled('min', year, month, _day)) {
      _day = minDay.getDate()
      month = minDay.getMonth()
      year = minDay.getFullYear()
    } else if (!checkDateEnabled('max', year, month, _day)) {
      _day = maxDay.getDate()
      month = maxDay.getMonth()
      year = maxDay.getFullYear()
    }
    setDaysOfMonth(daysOfMonth)
    setDay(new Date(year, month).getDay())
    setMonth(month)
    setYear(year)
    setSelectedDay(_day)
    _date = new Date(year, month, _day)
    if (!checkDateEnabled('min', year, month, focusedDay)) {
      setFocusedDay(minDay.getDate())
    } else if (!checkDateEnabled('max', year, month, focusedDay)) {
      setFocusedDay(maxDay.getDate())
    }

    !showDateRange && handleOnChange(_date)
    !showDateRange && changeInputValue && changeInputValue(_date, true)
    if (count !== undefined && !(typeof count === 'object')) {
      if (type === 1) {
        if (!checkDateEnabled('min', year, month, daysOfMonth + count)) {
          setFocusedDay(minDay.getDate())
        } else {
          setFocusedDay(daysOfMonth + count)
        }
      } else {
        setFocusedDay(0 + count)
      }
    }
  }

  const next = (count) => {
    const nextMonth = (month + 1) % 12
    const nextYear = nextMonth === 0 ? year + 1 : year
    setDateState(nextMonth, nextYear, 2, count)
  }

  const previous = (count) => {
    const previousMonth = (month + 11) % 12
    const previousYear = previousMonth === 11 ? year - 1 : year
    setDateState(previousMonth, previousYear, 1, count)
  }

  useEffect(() => {
    currentCell.current && currentCell.current.focus()
  }, [focusedDay])

  const handleKeyPress = (e, weekIndex, daysOfMonth, _currentDate) => {
    var code = e.keyCode || e.which
    code !== 'Tab' && code !== 9 && e.preventDefault()

    if (e.shiftKey && code === 9) {
      //shift was down when tab was pressed
      setIsDayTabbed(false)
    } else {
      setIsDayTabbed(true)
    }

    switch (code) {
      /* Enter Key press */
      case 13:
        handleOnClick(_currentDate)
        break
      /* Left Key press */
      case 37:
        if (_currentDate > 1) {
          if (!checkDateEnabled('min', year, month, _currentDate - 1)) {
            return
          }
          setFocusedDay(_currentDate - 1)
        } else {
          if (!checkDateEnabled('min', year, month - 1, getDaysOfMonth(year, month))) {
            return
          }
          previous(0)
        }
        break
      /* Right Key press */
      case 39:
        if (_currentDate < daysOfMonth) {
          if (!checkDateEnabled('max', year, month, _currentDate + 1)) {
            return
          }
          setFocusedDay(_currentDate + 1)
        } else {
          if (!checkDateEnabled('max', year, month + 1, 1)) {
            return
          }
          next(1)
        }
        break
      /* Up Key press */
      case 38:
        if (weekIndex > 0 && _currentDate - 7 >= 1) {
          if (!checkDateEnabled('min', year, month, _currentDate - 7)) {
            return
          }
          setFocusedDay(_currentDate - 7)
        } else {
          if (!checkDateEnabled('min', year, month - 1, getDaysOfMonth(year, month) + (_currentDate - 7))) {
            if (minDay.getMonth() - 1 !== month - 1) previous(minDay.getDate())
            else return
          }
          previous(_currentDate - 7)
        }

        break

      /* Down Key press */
      case 40:
        if (weekIndex < 5 && _currentDate + 7 <= daysOfMonth) {
          if (!checkDateEnabled('max', year, month, _currentDate + 7)) {
            return
          }
          setFocusedDay(_currentDate + 7)
        } else {
          let count = _currentDate + 7 - daysOfMonth
          let _year = month === 11 ? year + 1 : year
          let _month = month === 11 ? 0 : month + 1
          if (!checkDateEnabled('max', _year, _month + 1, 0 + count)) {
            if (maxDay.getMonth() - 1 !== month && maxDay.getFullYear() !== year) next(maxDay.getDate())
            else return
          } else {
            next(count)
          }
        }
        break
      default:
        return
    }
  }
  const handleFocus = (e, _type) => {
    const { current } = currentCell
    const { current: nextButton } = nextBtn
    if (_type === 1 && current) {
      current.focus()
    }
    if (_type === 2) {
      if (isDayTabbed) {
        current.focus()
      } else {
        nextButton.focus()
      }
    }
  }

  const createCalendar = () => {
    let isDisabled = true
    let rows = []
    let date = 1
    const localeDaySequence = getLocaleDaySequence(locale, localeToFirstDayMap)
    for (let i = 0; i < 6; i++) {
      let columns = []
      for (let j of localeDaySequence) {
        if (i === 0 && localeDaySequence.indexOf(j) < localeDaySequence.indexOf(day)) {
          columns.push(<td key={j}></td>)
        } else if (date > daysOfMonth) {
          break
        } else {
          let currentDate = date
          const currentDay = new Date(year, month, date)
          isDisabled =
            (minDayPresent && currentDay.getTime() < minDay.getTime()) || (maxDayPresent && currentDay.getTime() > maxDay.getTime())
          columns.push(
            <td
              key={j}
              role='button'
              tabIndex={date === focusedDay && !isDisabled ? '2' : '-1'}
              ref={date === focusedDay && !isDisabled ? currentCell : null}
              style={{ padding: showDateRange && showPreDefinedRange ? '4px 0' : '10px 0' }}
            >
              <Button
                type='button'
                classes={classList(
                  'day-wrapper',
                  !showDateRange && date === selectedDay && !isDisabled && 'active',
                  date === focusedDay && !isDisabled && 'focused',
                  isDisabled && 'disabled',
                  showDateRange &&
                    !isDisabled &&
                    isWithinInterval(new Date(year, month, date), { start: dateRange?.startDate, end: dateRange?.endDate }) &&
                    'active-light',
                  showDateRange &&
                    (dateRange?.startDate?.getTime() === new Date(year, month, date)?.getTime() ||
                      dateRange?.endDate?.getTime() === new Date(year, month, date)?.getTime()) &&
                    'active'
                )}
                handleOnClick={() => {
                  handleOnClick(currentDate)
                }}
                onKeyDown={(e) => {
                  handleKeyPress(e, i, daysOfMonth, currentDate)
                }}
                isPointRipple={true}
                xCoord={3}
                yCoord={3}
              >
                {date++}
              </Button>
            </td>
          )
        }
      }
      rows.push(<tr key={i}>{columns}</tr>)
    }
    return rows
  }

  const handleMonthsDropdown = (event) => {
    event.stopPropagation()
    const toggleMonthsDropdown = !showMonths
    setTimeout(() => {
      setShowMonths(toggleMonthsDropdown)
    }, 200)
    // selectedMonthOption.current.scrollIntoView()
  }

  const handleYearsDropdown = (event) => {
    event.stopPropagation()
    const toggleYearsDropdown = !showYears
    setTimeout(() => {
      setShowYears(toggleYearsDropdown)
    }, 200)
    // selectedYearOption.current.scrollIntoView()
  }

  const handleMonthSelection = (selectedMonth) => {
    const translatedMonths = getTranslatedMonths(language)
    const monthIndex = translatedMonths.indexOf(selectedMonth)
    setDateState(monthIndex, year)
  }

  const handleYearSelection = (selectedYear) => {
    setDateState(month, selectedYear)
  }

  const handleScroll = (scrollDiv, setter) => {
    if (scrollDiv.offsetHeight === scrollDiv.scrollHeight) {
      setter('non-scrollable')
    } else if (scrollDiv.scrollTop + scrollDiv.offsetHeight === scrollDiv.scrollHeight) {
      setter('bottom')
    } else if (scrollDiv.scrollTop + scrollDiv.offsetHeight === scrollDiv.offsetHeight) {
      setter('top')
    } else {
      setter('scrollable')
    }
  }

  const scrollToTop = (e, scrollableDiv) => {
    e.stopPropagation()
    scrollableDiv.current.scrollTop = 0
  }

  const scrollToBottom = (e, scrollableDiv) => {
    e.stopPropagation()
    scrollableDiv.current.scrollTop = scrollableDiv.current.scrollHeight
  }
  return (
    <div className='calendar-wrapper' ref={ref}>
      <div tabIndex='1' onFocus={(e) => handleFocus(e, 2)} className='focus-div top-focus-div'></div>
      <div className='calendar-body'>
        <table className='date-wrapper'>
          <thead>
            <tr className='month-wrapper'>
              {showPrevious ? (
                <td tabIndex='3' role='button'>
                  <Button
                    type='button'
                    classes='date-btn prev-btn'
                    onClick={previous}
                    onKeyPress={(e) => {
                      e.key === 'Enter' && previous()
                    }}
                    isPointRipple={true}
                  >
                    &lt;
                  </Button>
                </td>
              ) : (
                <td></td>
              )}
              <td colSpan={5}>
                <div className='heading-wrapper'>
                  <div ref={monthDropdownWrapper} className='selector' onClick={(e) => handleMonthsDropdown(e)}>
                    {months[month]}
                    <span className={` down-arrow`} />
                    <div className={`${showMonths ? `show-options` : ``} option-wrapper`}>
                      <div className='scroll-button' onClick={(e) => scrollToTop(e, monthDropdown)}>
                        {['non-scrollable', 'top'].indexOf(monthScrollStatus) === -1 && (
                          <img src={ArrowEnd} className='scroll-arrow-up' alt='Scroll Up' />
                        )}
                      </div>
                      <div className='selector-options' ref={monthDropdown} onScroll={(e) => handleScroll(e.target, setMonthScroll)}>
                        {Array.isArray(filteredMonths) &&
                          filteredMonths.map((eachOption, index) => {
                            return (
                              <div key={index} {...(index === month ? { ref: selectedMonthOption } : {})}>
                                <Button
                                  type='button'
                                  classes={`${index === month ? `active` : ``} option`}
                                  data-testid={index === month ? 'selected-month' : ''}
                                  handleOnClick={() => handleMonthSelection(eachOption)}
                                >
                                  {eachOption}
                                </Button>
                              </div>
                            )
                          })}
                      </div>
                      <div className='scroll-button' onClick={(e) => scrollToBottom(e, monthDropdown)}>
                        {['non-scrollable', 'bottom'].indexOf(monthScrollStatus) === -1 && (
                          <img src={ArrowEnd} className='scroll-arrow-down' alt='Scroll Down' />
                        )}
                      </div>
                    </div>
                  </div>
                  <div ref={yearDropdownWrapper} className='selector' onClick={(e) => handleYearsDropdown(e)}>
                    {year}
                    <span className='down-arrow' />
                    <div className={`${showYears ? `show-options` : ``} option-wrapper`}>
                      <div className='scroll-button' onClick={(e) => scrollToTop(e, yearDropdown)}>
                        {['non-scrollable', 'top'].indexOf(yearScrollStatus) === -1 && (
                          <img src={ArrowEnd} className='scroll-arrow-up' alt='Scroll Up' />
                        )}
                      </div>
                      <div className='selector-options' ref={yearDropdown} onScroll={(e) => handleScroll(e.target, setYearScroll)}>
                        {Array.isArray(months) &&
                          years.map((eachOption, index) => {
                            return (
                              <div key={index} {...(eachOption === year ? { ref: selectedYearOption } : {})}>
                                <Button
                                  type='button'
                                  classes={`${eachOption === year ? `active` : ``} option`}
                                  handleOnClick={() => handleYearSelection(eachOption)}
                                  data-testid={eachOption === year ? 'selected-year' : ''}
                                >
                                  {eachOption}
                                </Button>
                              </div>
                            )
                          })}
                      </div>
                      <div className='scroll-button' onClick={(e) => scrollToBottom(e, yearDropdown)}>
                        {['non-scrollable', 'bottom'].indexOf(yearScrollStatus) === -1 && (
                          <img src={ArrowEnd} className='scroll-arrow-down' alt='Scroll Down' />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              {showNext ? (
                <td tabIndex='4' role='button' ref={nextBtn}>
                  <Button
                    type='button'
                    classes='date-btn next-btn'
                    onClick={next}
                    onKeyPress={(e) => {
                      e.key === 'Enter' && next()
                    }}
                  >
                    &gt;
                  </Button>
                </td>
              ) : (
                <td></td>
              )}
            </tr>
            <tr className='weekday-wrapper'>
              {weekdays.map((weekday) => (
                <td key={weekday}>{weekday.substring(0, lettersInDayName)}</td>
              ))}
            </tr>
          </thead>
          <tbody>{createCalendar()}</tbody>
        </table>
        <div tabIndex='5' onFocus={(e) => handleFocus(e, 1)} className='focus-div bottom-focus-div'></div>
        {showDateRange && showPreDefinedRange && (
          <div className='calendar-right'>
            <Button
              type='button'
              handleOnClick={() => {
                handlePreDefinedRange('today')
              }}
              classes={'calendar-pre-button'}
              text={'Today'}
            />
            <Button
              type='button'
              handleOnClick={() => {
                handlePreDefinedRange('yesterday')
              }}
              classes={'calendar-pre-button'}
              text={'Yesterday'}
            />
            <Button
              type='button'
              handleOnClick={() => {
                handlePreDefinedRange('lastSeven')
              }}
              classes={'calendar-pre-button'}
              text={'Last 7 Days'}
            />
            <Button
              type='button'
              handleOnClick={() => {
                handlePreDefinedRange('lastThirty')
              }}
              classes={'calendar-pre-button'}
              text={'Last 30 Days'}
            />
            <Button
              type='button'
              handleOnClick={() => {
                handlePreDefinedRange('thisMonth')
              }}
              classes={'calendar-pre-button'}
              text={'This Month'}
            />
            <Button
              type='button'
              handleOnClick={() => {
                handlePreDefinedRange('lastMonth')
              }}
              classes={'calendar-pre-button'}
              text={'Last Month'}
            />
          </div>
        )}
      </div>
      {calendarFooter && <div className='calendar-footer'>{calendarFooter}</div>}
    </div>
  )
})

export default React.memo(Calendar)
