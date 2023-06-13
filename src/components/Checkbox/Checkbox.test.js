import React from 'react'
import { fireEvent, render, act, waitFor } from '@testing-library/react'
import Checkbox from './'

describe('Checkbox', () => {
  const props = {
    value: true,
    handleOnChange: jest.fn(),
  }

  it('should render', async () => {
    jest.useFakeTimers()
    const { getByText } = render(<Checkbox {...props}>First Checkbox</Checkbox>)
    fireEvent.click(getByText('First Checkbox'))
    act(() => jest.runAllTimers())
    expect(getByText('First Checkbox')).toBeInTheDocument
    jest.clearAllTimers()
  })

  it('should render tabs when type is tabs', async () => {
    jest.useFakeTimers()
    const { getByText } = render(
      <Checkbox type='tabs' {...props}>
        Second Checkbox
      </Checkbox>
    )
    fireEvent.click(getByText('Second Checkbox'))
    act(() => jest.runAllTimers())
    expect(getByText('Second Checkbox')).toBeInTheDocument()
  })
})
