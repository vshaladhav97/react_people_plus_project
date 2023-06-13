import React from 'react'
import DatePicker from './index'
import { render, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('DatePicker', () => {
  it('should render', () => {
    const { getByLabelText } = render(<DatePicker date={new Date()} handleOnChange={jest.fn()} focusCalendarInitially={false} />)
    fireEvent.click(getByLabelText('date-picker'))
    expect(getByLabelText('date-picker')).toBeInTheDocument()
  })

  it('should disable DatePicker', () => {
    const { getByLabelText } = render(<DatePicker date={new Date()} handleOnChange={jest.fn()} isDisabled={true} />)
    const input = getByLabelText('date-picker')
    expect(input).toHaveClass('date-picker-disabled')
    expect(getByLabelText('date-picker')).toBeInTheDocument()
  })

  it('should render Date Range', () => {
    const { getByLabelText } = render(<DatePicker dateRange={{}} handleOnChange={jest.fn()} showDateRange={true} />)
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    expect(getByLabelText('date-picker')).toBeInTheDocument()
  })

  it('should render Date Range', () => {
    const { getByLabelText, getByText } = render(
      <DatePicker
        dateRange={{ startDate: new Date('2021,03,15'), endDate: new Date('2021,03,19') }}
        handleOnChange={jest.fn()}
        showDateRange={true}
      />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    fireEvent.click(getByText('20'))
    fireEvent.click(getByText('28'))
    expect(getByText('28').parentElement).toHaveClass('focused')
  })

  it('should handle reverse range selection', () => {
    const { getByLabelText, getByText } = render(
      <DatePicker
        dateRange={{ startDate: new Date('2021,03,15'), endDate: new Date('2021,03,19') }}
        handleOnChange={jest.fn()}
        showDateRange={true}
      />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    fireEvent.click(getByText('28'))
    fireEvent.click(getByText('10'))
    expect(getByText('10').parentElement).toHaveClass('focused')
  })

  it('should capture enter keypress on input box of Date Range and open the calendar ', () => {
    const { getByLabelText } = render(
      <DatePicker
        dateRange={{ startDate: new Date('2021,03,15'), endDate: new Date('2021,03,19') }}
        handleOnChange={jest.fn()}
        showDateRange={true}
      />
    )
    const input = getByLabelText('date-picker')
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })
    expect(getByLabelText('date-picker')).toBeInTheDocument()
  })

  it('should still render blank input', () => {
    const { getByLabelText } = render(<DatePicker date='' handleOnChange={jest.fn()} />)
    expect(getByLabelText('date-picker')).toBeInTheDocument()
  })

  it('should render Calendar and on selection of a date it should render on input', () => {
    jest.useFakeTimers()
    const { getByLabelText, getAllByText, getByText } = render(<DatePicker date={new Date()} handleOnChange={jest.fn()} />)
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    fireEvent.mouseDown(getByText('M'))
    expect(getAllByText('S').length).toEqual(2)
    fireEvent.click(getByText('<'))
    fireEvent.click(getByText('1'))
    act(() => {
      jest.runAllTimers()
    })
    expect(input.value).toContain('1')
    jest.clearAllTimers()
  })

  it('should capture enter keypress on input box and open the calendar', () => {
    const { getByLabelText } = render(<DatePicker date={new Date()} handleOnChange={jest.fn()} />)
    const input = getByLabelText('date-picker')
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })
    expect(getByLabelText('date-picker')).toBeInTheDocument()
  })

  it('should capture focus event from top div', () => {
    const { container, getByLabelText } = render(<DatePicker date={new Date()} handleOnChange={jest.fn()} />)
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const topDiv = container.querySelector('.top-focus-div')
    fireEvent.focus(topDiv)
    expect(document.activeElement).toBe(container.querySelector('.focused').parentElement)
  })

  it('should capture focus event from bottom div', () => {
    const { container, getByLabelText } = render(<DatePicker date={new Date()} handleOnChange={jest.fn()} />)
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const bottomDiv = container.querySelector('.bottom-focus-div')
    fireEvent.focus(bottomDiv)
    expect(document.activeElement).toBe(container.querySelector('.focused').parentElement)
  })

  it('should capture Enter keyevents of day resulting in closure of calendar', () => {
    jest.useFakeTimers()
    const { container, getByLabelText } = render(<DatePicker date={new Date()} handleOnChange={jest.fn()} />)
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      keyCode: 13,
      charCode: 13,
    })
    act(() => {
      jest.runAllTimers()
    })
    expect(container.querySelector('.calendar-wrapper')).toBeNull()
    jest.clearAllTimers()
  })

  it('should capture Left keyevents of day and move to previous day', () => {
    const { container, getByLabelText } = render(<DatePicker date={new Date(2020, 11, 2)} handleOnChange={jest.fn()} />)
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      keyCode: 37,
      charCode: 37,
    })
    expect(container.querySelector('.focused')).toHaveTextContent(1)
  })

  it('should capture Left keyevents of day but incase of disabled it should not move focus', () => {
    const { container, getByLabelText } = render(
      <DatePicker date={new Date(2020, 11, 1)} handleOnChange={jest.fn()} minDay={new Date(2020, 11, 1)} />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      keyCode: 37,
      charCode: 37,
    })
    expect(container.querySelector('.focused')).toHaveTextContent(1)
  })

  it('should capture Left keyevents of day incase of first day of the month and move to last day of the previous month', () => {
    const { container, getByLabelText } = render(<DatePicker date={new Date(2020, 11, 1)} handleOnChange={jest.fn()} />)
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      keyCode: 37,
      charCode: 37,
    })
    expect(container.querySelector('.focused')).toHaveTextContent(30)
  })
  it('should capture Left keyevents of day incase of not first day of the month and not move due to disabled', () => {
    const { container, getByLabelText } = render(
      <DatePicker date={new Date(2020, 11, 2)} handleOnChange={jest.fn()} minDay={new Date(2020, 11, 2)} />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      keyCode: 37,
      charCode: 37,
    })
    expect(container.querySelector('.focused')).toHaveTextContent(2)
  })
  it('should capture Left keyevents of day incase of disabled of last month of the year', () => {
    const { container, getByLabelText } = render(
      <DatePicker date={new Date(2020, 11, 1)} handleOnChange={jest.fn()} minDay={new Date(2020, 11, 1)} />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      keyCode: 37,
      charCode: 37,
    })
    expect(container.querySelector('.focused')).toHaveTextContent(1)
  })

  it('should capture Right keyevents of day and move to next day', () => {
    const { container, getByLabelText } = render(<DatePicker date={new Date(2020, 11, 1)} handleOnChange={jest.fn()} />)
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      keyCode: 39,
      charCode: 39,
    })
    expect(container.querySelector('.focused')).toHaveTextContent(2)
  })

  it('should not move to next day incase of disabled', () => {
    const { container, getByLabelText } = render(
      <DatePicker date={new Date(2020, 11, 1)} handleOnChange={jest.fn()} maxDay={new Date(2020, 11, 1)} />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      keyCode: 39,
      charCode: 39,
    })
    expect(container.querySelector('.focused')).toHaveTextContent(1)
  })

  it('should capture Right keyevents of day incase of last day of the month and move to first day of next month', () => {
    const { container, getByLabelText } = render(<DatePicker date={new Date(2020, 11, 31)} handleOnChange={jest.fn()} />)
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      keyCode: 39,
      charCode: 39,
    })
    expect(container.querySelector('.focused')).toHaveTextContent(1)
  })

  it('should capture Right keyevents of day incase of disabled of next month and not move to next day', () => {
    const { container, getByLabelText } = render(
      <DatePicker date={new Date(2020, 11, 31)} handleOnChange={jest.fn()} maxDay={new Date(2020, 11, 31)} />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      keyCode: 39,
      charCode: 39,
    })
    expect(container.querySelector('.focused')).toHaveTextContent(31)
  })

  it('should capture Up keyevents of day and move 7 days prior to current selection', () => {
    const { container, getByLabelText } = render(<DatePicker date={new Date(2020, 11, 30)} handleOnChange={jest.fn()} />)
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      keyCode: 38,
      charCode: 38,
    })
    expect(container.querySelector('.focused')).toHaveTextContent(23)
  })

  it('should capture Up keyevents of day but incase of disabled should not move the focus', () => {
    const { container, getByLabelText } = render(
      <DatePicker date={new Date(2020, 11, 9)} handleOnChange={jest.fn()} minDay={new Date(2020, 11, 8)} />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      keyCode: 38,
      charCode: 38,
    })
    expect(container.querySelector('.focused')).toHaveTextContent(9)
  })

  it('should capture Up keyevents of day incase of first day of the month it should move to previous month', () => {
    const { container, getByLabelText } = render(<DatePicker date={new Date(2020, 11, 1)} handleOnChange={jest.fn()} />)
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      keyCode: 38,
      charCode: 38,
    })
    expect(container.querySelector('.focused')).toHaveTextContent(24)
  })

  it('should capture Up keyevents of day incase of disabled of this month no action expected', () => {
    const { container, getByLabelText } = render(
      <DatePicker date={new Date(2020, 11, 2)} handleOnChange={jest.fn()} minDay={new Date(2020, 11, 1)} />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      keyCode: 38,
      charCode: 38,
    })
    expect(container.querySelector('.focused')).toHaveTextContent(2)
  })

  it('should capture Up keyevents of day incase of disabled of previous month', () => {
    const { container, getByLabelText } = render(
      <DatePicker date={new Date(2020, 11, 3)} handleOnChange={jest.fn()} minDay={new Date(2020, 10, 28)} />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      keyCode: 38,
      charCode: 38,
    })
    expect(container.querySelector('.focused')).toHaveTextContent(28)
  })

  it('should not capture any key event functionality for unlisted keys', () => {
    const { container, getByLabelText } = render(
      <DatePicker date={new Date(2020, 11, 3)} handleOnChange={jest.fn()} minDay={new Date(2020, 10, 28)} />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      which: 76,
      charCode: 76,
    })
    expect(container.querySelector('.focused')).toHaveTextContent(3)
  })

  it('should capture Enter for prev button', () => {
    const { container, getByLabelText } = render(<DatePicker date={new Date(2020, 11, 3)} handleOnChange={jest.fn()} />)
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedNav = container.querySelector('.prev-btn')
    userEvent.tab()
    fireEvent.keyPress(focusedNav, { key: 'Enter', code: 13, charCode: 13 })
    expect(document.activeElement).toBe(focusedNav.parentElement)
  })
  it('should capture Enter for next button ', () => {
    const { container, getByLabelText } = render(<DatePicker date={new Date(2020, 11, 3)} handleOnChange={jest.fn()} />)
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedNav = container.querySelector('.next-btn')
    userEvent.tab()
    userEvent.tab()
    fireEvent.keyPress(focusedNav, { key: 'Enter', code: 13 })
    expect(document.activeElement).toBe(focusedNav.parentElement)
  })
  // it('should capture shift tab event', () => {
  //   const { container, getByLabelText } = render(<DatePicker date={new Date()} handleOnChange={jest.fn()} />)
  //   const input = getByLabelText('date-picker')
  //   fireEvent.click(input)
  //   const focusedPill = container.querySelector('.focused')
  //   fireEvent.focus(focusedPill)
  //   fireEvent.keyDown(focusedPill, {
  //     shiftKey: true,
  //     key: 'Tab',
  //     code: 'Tab',
  //     keyCode: 9,
  //     charCode: 9,
  //   })
  //   expect(container.querySelector('.focused')).toHaveFocus()
  // })

  it('should capture shift tab focus event', () => {
    const { container, getByLabelText } = render(<DatePicker date={new Date()} handleOnChange={jest.fn()} />)
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    const topDiv = container.querySelector('.top-focus-div')
    fireEvent.focus(focusedPill)
    fireEvent.keyDown(focusedPill, {
      shiftKey: true,
      key: 'Tab',
      code: 'Tab',
      keyCode: 9,
      charCode: 9,
    })
    fireEvent.focus(topDiv)
    expect(document.activeElement).toBe(container.querySelector('.next-btn').parentElement)
  })

  it('should capture Down keyevents of Day and focus 7th day from current focused day', () => {
    const { container, getByLabelText } = render(<DatePicker date={new Date(2020, 11, 1)} handleOnChange={jest.fn()} />)
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      keyCode: 40,
      charCode: 40,
    })
    expect(container.querySelector('.focused')).toHaveTextContent(8)
  })

  it('should capture Down keyevents of day before the last week but incase of disabled no action expected', () => {
    const { container, getByLabelText } = render(
      <DatePicker date={new Date(2020, 1, 11)} handleOnChange={jest.fn()} maxDay={new Date(2020, 1, 11)} />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      keyCode: 40,
      charCode: 40,
    })
    expect(container.querySelector('.focused')).toHaveTextContent(11)
  })

  it('should capture Down keyevents of day incase of last day of the month should move the focus to next month', () => {
    const { container, getByLabelText } = render(<DatePicker date={new Date(2020, 11, 31)} handleOnChange={jest.fn()} />)
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      keyCode: 40,
      charCode: 40,
    })
    expect(container.querySelector('.focused')).toHaveTextContent(7)
  })
  it('should capture Down keyevents of day incase of disabled of same month not action expected', () => {
    const { container, getByLabelText } = render(
      <DatePicker date={new Date(2020, 11, 31)} handleOnChange={jest.fn()} maxDay={new Date(2020, 11, 31)} />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      keyCode: 40,
      charCode: 40,
    })
    expect(container.querySelector('.focused')).toHaveTextContent(31)
  })
  it('should capture Down keyevents of day incase of disabled of next month should focus the max day of next month', () => {
    const { container, getByLabelText } = render(
      <DatePicker date={new Date(2020, 11, 31)} handleOnChange={jest.fn()} maxDay={new Date(2021, 0, 3)} />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      keyCode: 40,
      charCode: 40,
    })
    expect(container.querySelector('.focused')).toHaveTextContent(3)
  })
  it('should capture Down keyevents of day incase of disabled not being the next month', () => {
    const { container, getByLabelText } = render(
      <DatePicker date={new Date(2020, 9, 30)} handleOnChange={jest.fn()} maxDay={new Date(2021, 0, 3)} />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    const focusedPill = container.querySelector('.focused')
    fireEvent.keyDown(focusedPill, {
      keyCode: 40,
      charCode: 40,
    })
    expect(container.querySelector('.focused')).toHaveTextContent(6)
  })

  it('should close Calendar on outside click', () => {
    const div = document.createElement('div')
    div.textContent = 'test'
    div.addEventListener('click', jest.fn())
    document.body.appendChild(div)
    const { getByLabelText, getByText, container } = render(<DatePicker date={new Date()} handleOnChange={jest.fn()} />)
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    fireEvent.mouseDown(getByText('test'))
    expect(container.querySelector('.calendar-wrapper')).toBeNull()
  })

  it('should fire input event with minDay and maxDay same as current date', () => {
    const { getByLabelText, getAllByText } = render(
      <DatePicker date={new Date()} handleOnChange={jest.fn()} minDay={new Date()} maxDay={new Date()} />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    expect(getAllByText('S').length).toEqual(2)
  })

  it('should fire input event with valid value', () => {
    const { getByLabelText } = render(<DatePicker date={new Date()} handleOnChange={jest.fn()} config={{}} />)
    const input = getByLabelText('date-picker')
    fireEvent.change(input, {
      target: {
        value: '03/04/2020',
      },
    })
    expect(input.value).toEqual('03/04/2020')
  })

  it('should fire input event with an invalid value', () => {
    const { getByLabelText } = render(<DatePicker date={new Date()} handleOnChange={jest.fn()} minDay={new Date()} maxDay={new Date()} />)
    const input = getByLabelText('date-picker')
    fireEvent.change(input, {
      target: {
        value: '03/04/2020',
      },
    })
    expect(input.value).toEqual('03/04/2020')
  })

  it('should format based on the format passed', () => {
    const { getByLabelText } = render(<DatePicker date={new Date()} handleOnChange={jest.fn()} format='dd/mm/yyyy' />)
    const input = getByLabelText('date-picker')
    fireEvent.change(input, {
      target: {
        value: '03/04/2020',
      },
    })
    expect(input.value).toEqual('03/04/2020')
  })

  it('should support date range events', () => {
    jest.useFakeTimers()
    const onChangeHandler = jest.fn()
    const { getByLabelText, getByText } = render(
      <DatePicker
        placeholder='MM/DD/YYYY'
        format='dd/mm/yyyy'
        dateRange={{ startDate: new Date('2021/05/30'), endDate: new Date('2021/05/30') }}
        handleOnChange={onChangeHandler}
        showDateRange={true}
      />
    )
    userEvent.click(getByLabelText('date-picker'))
    userEvent.click(getByText('21'))
    act(() => {
      jest.runAllTimers()
    })
    userEvent.click(getByText('19'))
    expect(onChangeHandler).toHaveBeenCalled()
    jest.clearAllTimers()
  })

  it('should show template range when necessary', () => {
    const onChangeHandler = jest.fn()
    const { getByText, getByLabelText } = render(
      <DatePicker
        placeholder='MM/DD/YYYY'
        format='dd/mm/yyyy'
        dateRange={{ startDate: new Date('2021/05/30'), endDate: new Date('2021/05/30') }}
        handleOnChange={onChangeHandler}
        showDateRange={true}
        showPreDefinedRange
      />
    )
    userEvent.click(getByLabelText('date-picker'))
    userEvent.click(getByText('Today'))
    userEvent.click(getByText('Yesterday'))
    userEvent.click(getByText('Last 7 Days'))
    userEvent.click(getByText('Last 30 Days'))
    userEvent.click(getByText('This Month'))
    userEvent.click(getByText('Last Month'))
    expect(onChangeHandler).toBeCalledTimes(6)
  })
  it('should render a Filter button on selection of a date when showFilterBtn is passed as true', () => {
    const { getByLabelText, getByText } = render(
      <DatePicker
        showFilterBtn={true}
        dateRange={{ startDate: new Date('2021,03,15'), endDate: new Date('2021,03,19') }}
        handleOnChange={jest.fn()}
        showDateRange={true}
      />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    fireEvent.click(getByText('1'))
    expect(getByText('Filter')).toBeInTheDocument()
  })

  it('should call onFilterBtnClick prop when the Filter button is clicked', () => {
    const customFilter = jest.fn()
    const { getByLabelText, getByText } = render(
      <DatePicker
        showFilterBtn={true}
        onFilterBtnClick={() => customFilter()}
        dateRange={{ startDate: new Date('2021,03,15'), endDate: new Date('2021,03,19') }}
        handleOnChange={jest.fn()}
        showDateRange={true}
      />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    fireEvent.click(getByText('1'))
    fireEvent.click(getByText('Filter'))
    expect(customFilter).toHaveBeenCalled()
  })

  it('should call handleOnChange prop when the second day is pressed', () => {
    const customFilter = jest.fn()
    const currentDate = new Date()
    jest.useFakeTimers()
    const { getByLabelText, getByText } = render(
      <DatePicker dateRange={{ startDate: currentDate, endDate: currentDate }} handleOnChange={customFilter} showDateRange={true} />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    fireEvent.click(getByText('<'))
    userEvent.click(getByText('10'))
    act(() => {
      jest.runAllTimers()
    })
    userEvent.click(getByText('5'))
    expect(customFilter).toHaveBeenCalled()
    jest.clearAllTimers()
  })

  it('should render properly when two digit year format is required', () => {
    const { container, rerender } = render(<DatePicker date={''} format='dd/mm/yy' handleOnChange={jest.fn()} />)
    const input = container.querySelector('input')
    fireEvent.change(input, { target: { value: '15/03/22' } })
    rerender(<DatePicker date={new Date('2022/03/15')} format='dd/mm/yy' handleOnChange={jest.fn()} />)
    expect(input).toHaveValue('15/03/22')
  })

  it('should render the footer', () => {
    const { getByLabelText, getByText } = render(
      <DatePicker date={''} format='dd/mm/yy' handleOnChange={jest.fn()} calendarFooter={'footer'} />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    expect(getByText('footer')).toBeInTheDocument()
  })

  it('should render the floating label', () => {
    const { getByLabelText, getByText } = render(
      <DatePicker date={''} format='dd/mm/yy' floatingLabel={true} label='Enter date' handleOnChange={jest.fn()} />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    expect(getByText('Enter date')).toBeInTheDocument()
  })

  it('should remove the floating label when pressed outside the input box and input box has no value', () => {
    const div = document.createElement('div')
    div.textContent = 'outsideElement'
    div.addEventListener('click', jest.fn())
    document.body.appendChild(div)
    const { getByLabelText, getByText, container } = render(
      <DatePicker date={''} format='dd/mm/yy' floatingLabel={true} label='Enter date' handleOnChange={jest.fn()} />
    )
    const input = getByLabelText('date-picker')
    fireEvent.click(input)
    fireEvent.mouseDown(getByText('outsideElement'))
    expect(container.querySelector('.label-active')).not.toBeInTheDocument()
  })
})
