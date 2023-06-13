import { render, fireEvent, waitFor } from '@testing-library/react'
import useSlideAnimation from './useSlideAnimation'
import React from 'react'
import userEvent from '@testing-library/user-event'

const TestComponent = () => {
  const className = useSlideAnimation('/')
  return (
    <div className={className}>
      test
      <button
        onClick={() => {
          fireEvent(
            window,
            new window.PopStateEvent('popstate', {
              location: '/home',
              state: { page: 2 },
            })
          )
        }}
      >
        home
      </button>
    </div>
  )
}

describe('useSlideAnimation hook', () => {
  it('should add className slide-out during popstate event ', async () => {
    const { getByText, container } = render(<TestComponent />)
    userEvent.click(getByText('home'))
    await waitFor(() => expect(container.firstChild).toHaveClass('slide-out'))
  })
})
