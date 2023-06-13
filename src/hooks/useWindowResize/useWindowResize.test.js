import React from 'react'
import { render, act } from '@testing-library/react'
import useWindowResize from './useWindowResize'

const TestComponent = ({ handleResize }) => {
  const screen = useWindowResize(handleResize)
  return <div id='screen-div'>{screen}</div>
}

const resizeWindow = (x, y) => {
  window.innerWidth = x
  window.innerHeight = y
  window.dispatchEvent(new Event('resize'))
}

describe('useScroll hook', () => {
  it('should call the handler on scroll event', () => {
    const handleResize = jest.fn()
    render(<TestComponent handleResize={handleResize} />)
    expect(handleResize).toBeCalled()
  })

  it('should return xsmall when screen size is xsmall', () => {
    const { container } = render(<TestComponent />)
    //actions that result in a state change must be wrapped in act
    act(() => resizeWindow(599, 824))
    expect(container.querySelector('#screen-div')).toHaveTextContent('xsmall')
  })

  it('should return small when screen size is small', () => {
    const { container } = render(<TestComponent />)
    //actions that result in a state change must be wrapped in act
    act(() => resizeWindow(601, 824))
    expect(container.querySelector('#screen-div')).toHaveTextContent('small')
  })

  it('should return medium when screen size is medium', () => {
    const { container } = render(<TestComponent />)
    //actions that result in a state change must be wrapped in act
    act(() => resizeWindow(769, 824))
    expect(container.querySelector('#screen-div')).toHaveTextContent('medium')
  })

  it('should return large when screen size is large', () => {
    const { container } = render(<TestComponent />)
    //actions that result in a state change must be wrapped in act
    act(() => resizeWindow(993, 824))
    expect(container.querySelector('#screen-div')).toHaveTextContent('large')
  })

  it('should return xlarge when screen size is xlarge', () => {
    const { container } = render(<TestComponent />)
    //actions that result in a state change must be wrapped in act
    act(() => resizeWindow(1201, 824))
    expect(container.querySelector('#screen-div')).toHaveTextContent('xlarge')
  })
})
