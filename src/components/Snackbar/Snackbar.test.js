import React from 'react'
import Snackbar from './'
import { render } from '@testing-library/react'

describe('Snackbar component', () => {
  const props = {
    message: 'Snackbar test',
    type: 'success',
    callback: jest.fn(),
  }

  it('should render', () => {
    window.scrollTo = jest.fn()
    jest.useFakeTimers()
    const { getByText } = render(<Snackbar {...props} />)
    jest.runAllTimers()
    expect(getByText('Snackbar test')).toBeInTheDocument()
  })

  it('should render custom images', () => {
    window.scrollTo = jest.fn()
    jest.useFakeTimers()
    render(<Snackbar {...props} imagePath={'./success-alert.svg'} />)
    jest.runAllTimers()
    const displayedImage = document.querySelector('img')
    expect(displayedImage.src).toContain('success-alert')
  })
})
