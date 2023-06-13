import React from 'react'
import { render } from '@testing-library/react'
import useScroll from './useScroll'

const TestComponent = ({ handleScroll }) => {
  useScroll(handleScroll)
  return <div>test</div>
}

describe('useScroll hook', () => {
  it('should call the handler on scroll event', () => {
    const handleScroll = jest.fn()
    render(<TestComponent handleScroll={handleScroll} />)
    expect(handleScroll).toBeCalled()
  })
})
