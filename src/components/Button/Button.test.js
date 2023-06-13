import React from 'react'
import Button from '.'
import { act, fireEvent, render } from '@testing-library/react'

describe('Button component', () => {
  it('should render', () => {
    jest.useFakeTimers()
    const props = {
      text: 'Button 1',
      handleOnClick: jest.fn(),
    }
    const { getByText } = render(<Button {...props} />)
    fireEvent.click(getByText('Button 1'))
    act(() => jest.runAllTimers())
    expect(getByText('Button 1')).toBeInTheDocument()
  })
  it('should render children', () => {
    const props = {
      handleOnClick: jest.fn(),
    }
    const { getByText } = render(<Button {...props}>Button 2</Button>)
    expect(getByText('Button 2')).toBeInTheDocument()
  })
  it('should render the loader whenever required', () => {
    const { container } = render(<Button text='Button 3' isLoading={true}/>)
    expect(container.getElementsByClassName('button__loader')[0]).toBeInTheDocument()
  })
})
