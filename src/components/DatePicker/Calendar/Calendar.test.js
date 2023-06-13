import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import Calendar from '.'

describe('Calendar', () => {
  it('should fire click event on next', () => {
    const { getByText } = render(<Calendar date={new Date('02/03/2020')} handleOnChange={jest.fn()} maxDay={new Date('03/02/2020')} />)
    const calendarElement = getByText('>')
    fireEvent.click(calendarElement)
    expect(calendarElement).not.toBeInTheDocument()
  })

  it('should contain class active', () => {
    const changeInputRangeValue = jest.fn()
    const { getByText } = render(
      <Calendar
        dateRange={{ startDate: new Date('2021,03,15'), endDate: new Date('2021,03,18') }}
        handleOnChange={jest.fn()}
        changeInputRangeValue={changeInputRangeValue}
        showDateRange={true}
      />
    )
    fireEvent.click(getByText('18'))
    expect(getByText('18').parentElement).toHaveClass('focused')
  })

  it('should render without dateRange', () => {
    const changeInputRangeValue = jest.fn()
    const { getByText } = render(
      <Calendar dateRange={{}} handleOnChange={jest.fn()} changeInputRangeValue={changeInputRangeValue} showDateRange={true} />
    )
    expect(getByText(new Date().getDate().toString()).parentElement).toHaveClass('focused')
  })

  it('should fire click event on next and go to next year', () => {
    const { getByText, getByTestId } = render(<Calendar date={new Date('12/10/2020')} handleOnChange={jest.fn()} />)
    fireEvent.click(getByText('>'))
    expect(getByTestId('selected-month')).toHaveTextContent('January')
    expect(getByTestId('selected-year')).toHaveTextContent('2021')
  })

  it('should fire key press event on next', () => {
    const { getByText, getByTestId } = render(<Calendar date={new Date('12/10/2020')} handleOnChange={jest.fn()} />)
    fireEvent.keyPress(getByText('>'), { key: 'Enter', code: 13, charCode: 13 })
    expect(getByTestId('selected-month')).toHaveTextContent('January')
    expect(getByTestId('selected-year')).toHaveTextContent('2021')
  })

  it('should fire click event on previous', () => {
    const { getByText } = render(
      <Calendar date={new Date('03/20/2020')} handleOnChange={jest.fn()} minDay={new Date('02/21/2020')} changeInputValue={jest.fn()} />
    )
    const calendarElement = getByText('<')
    fireEvent.click(calendarElement)
    expect(calendarElement).not.toBeInTheDocument()
  })

  it('should fire click event on previous and go to previous year', () => {
    const { getByText, getByTestId } = render(<Calendar date={new Date('01/10/2020')} handleOnChange={jest.fn()} />)
    fireEvent.click(getByText('<'))
    expect(getByTestId('selected-month')).toHaveTextContent('December')
    expect(getByTestId('selected-year')).toHaveTextContent('2019')
  })

  it('should render 29th of February when date is greater on previous', () => {
    const { getByText } = render(<Calendar date={new Date('03/30/2020')} handleOnChange={jest.fn()} changeInputValue={jest.fn()} />)
    fireEvent.click(getByText('<'))
    expect(getByText('29').parentElement).toHaveClass('active')
  })

  it('should render current date if correct Date object is not passed', () => {
    const { getByText } = render(<Calendar date='test' handleOnChange={jest.fn()} />)
    const date = new Date().getDate().toString()
    expect(getByText(date).parentElement).toHaveClass('active')
  })

  // Month Year Selector Test
  it('should open the month dropdown', () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn()
    const { container } = render(<Calendar date={new Date('01/10/2020')} handleOnChange={jest.fn()} />)
    const selector = container.getElementsByClassName('selector')
    fireEvent.click(selector[0])
    expect(container.getElementsByClassName('show-options')[0])
  })

  it('should open the year dropdown', () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn()
    const { container } = render(<Calendar date={new Date('01/10/2020')} handleOnChange={jest.fn()} />)
    const selector = container.getElementsByClassName('selector')
    fireEvent.click(selector[1])
    expect(container.getElementsByClassName('show-options')[0])
  })

  it('should open the month dropdown and select month', async () => {
    jest.useFakeTimers()
    const { container, getByTestId } = render(<Calendar date={new Date()} handleOnChange={jest.fn()} />)
    const selector = container.getElementsByClassName('selector')
    fireEvent.click(selector[0])
    act(() => {
      jest.runAllTimers()
    })
    const months = container.querySelector('.show-options .selector-options').children
    const buttonElement = months[0].children
    fireEvent.click(buttonElement[0])
    const selectedMonth = getByTestId('selected-month')
    expect(selectedMonth).toHaveTextContent('January')
    jest.clearAllTimers()
  })

  it('should open the year dropdown and select year', async () => {
    jest.useFakeTimers()
    const { container, getByTestId } = render(<Calendar date={new Date()} handleOnChange={jest.fn()} />)
    const selector = container.getElementsByClassName('selector')
    fireEvent.click(selector[1])
    act(() => {
      jest.runAllTimers()
    })
    const years = container.querySelector('.show-options .selector-options').children
    const buttonElement = years[0].children
    fireEvent.click(buttonElement[0])
    const selectedYear = new Date().getFullYear() - 99
    const selectedYearEle = getByTestId('selected-year')
    expect(selectedYearEle).toHaveTextContent(selectedYear)
    jest.clearAllTimers()
  })

  it('should open the month dropdown and scroll to top', async () => {
    jest.useFakeTimers()
    const { container } = render(<Calendar date={new Date()} handleOnChange={jest.fn()} />)
    const selector = container.getElementsByClassName('selector')
    fireEvent.click(selector[0])
    act(() => {
      jest.runAllTimers()
    })
    const months = container.querySelector('.show-options .selector-options')
    fireEvent.scroll(months, { target: { scrollY: 0 } })
    const arrowUp = container.querySelector('.show-options .scroll-arrow-up')
    expect(arrowUp).toBeFalsy()
    jest.clearAllTimers()
  })

  it('should open the year dropdown and scroll to top', async () => {
    jest.useFakeTimers()
    const { container } = render(<Calendar date={new Date()} handleOnChange={jest.fn()} />)
    const selector = container.getElementsByClassName('selector')
    fireEvent.click(selector[1])
    act(() => {
      jest.runAllTimers()
    })
    const years = container.querySelector('.show-options .selector-options')
    fireEvent.scroll(years, { target: { scrollY: 0 } })
    const arrowUp = container.querySelector('.show-options .scroll-arrow-up')
    expect(arrowUp).toBeFalsy()
    jest.clearAllTimers()
  })

  it('Should scroll months to bottom on click of arrow', async () => {
    jest.useFakeTimers()
    const { container } = render(<Calendar date={new Date()} handleOnChange={jest.fn()} />)
    const selector = container.getElementsByClassName('selector')
    fireEvent.click(selector[0])
    act(() => {
      jest.runAllTimers()
    })
    const scrollButtons = container.querySelectorAll('.show-options .scroll-button')
    fireEvent.click(scrollButtons[1])
    const arrowDown = container.querySelector('.show-options .scroll-arrow-down')
    expect(arrowDown).toBeFalsy()
    jest.clearAllTimers()
  })

  it('Should scroll years to bottom on click of arrow', async () => {
    jest.useFakeTimers()
    const { container } = render(<Calendar date={new Date()} handleOnChange={jest.fn()} />)
    const selector = container.getElementsByClassName('selector')
    fireEvent.click(selector[1])
    act(() => {
      jest.runAllTimers()
    })
    const scrollButtons = container.querySelectorAll('.show-options .scroll-button')
    fireEvent.click(scrollButtons[1])
    const arrowDown = container.querySelector('.show-options .scroll-arrow-down')
    expect(arrowDown).toBeFalsy()
    jest.clearAllTimers()
  })

  it('Should scroll months to top on click of arrow', async () => {
    jest.useFakeTimers()
    const { container } = render(<Calendar date={new Date()} handleOnChange={jest.fn()} />)
    const selector = container.getElementsByClassName('selector')
    fireEvent.click(selector[0])
    act(() => {
      jest.runAllTimers()
    })
    const scrollButtons = container.querySelectorAll('.show-options .scroll-button')
    fireEvent.click(scrollButtons[0])
    const arrowUp = container.querySelector('.show-options .scroll-arrow-up')
    expect(arrowUp).toBeFalsy()
    jest.clearAllTimers()
  })

  it('Should scroll years to top on click of arrow', async () => {
    jest.useFakeTimers()
    const { container } = render(<Calendar date={new Date()} handleOnChange={jest.fn()} />)
    const selector = container.getElementsByClassName('selector')
    fireEvent.click(selector[1])
    act(() => {
      jest.runAllTimers()
    })
    const scrollButtons = container.querySelectorAll('.show-options .scroll-button')
    fireEvent.click(scrollButtons[0])
    const arrowUp = container.querySelector('.show-options .scroll-arrow-up')
    expect(arrowUp).toBeFalsy()
    jest.clearAllTimers()
  })
})
