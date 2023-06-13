import React from 'react'
import Radio from '.'
import { render, fireEvent, screen, act } from '@testing-library/react'

describe('Radio Button component', () => {
  const props = {
    value: '1',
    handleOnUpdate: jest.fn(),
    label: 'Opt 3',
  }
  let tree
  beforeAll(() => {
    tree = (
      <>
        <Radio {...props}>option 1</Radio>
      </>
    )
  })
  it('should render', () => {
    const { getByLabelText } = render(tree)
    expect(getByLabelText('radio-button')).toBeInTheDocument()
  })

  it('Changes the value based on the radio buttons', () => {
    const props1 = {
      value: 'a',
      handleOnUpdate: jest.fn(),
    }
    const props2 = {
      value: 'b',
      handleOnUpdate: jest.fn(),
    }
    jest.useFakeTimers()
    const { getByText, getByLabelText } = render(
      <>
        <Radio {...props1}>Opt 1</Radio>
        <Radio {...props2}>Opt 2</Radio>
      </>
    )
    const radio = getByLabelText(/Opt 1/i)
    fireEvent.click(radio, { target: { value: 'b' } })
    act(() => jest.runAllTimers())
    expect(getByText('Opt 1')).toBeInTheDocument()
    jest.clearAllTimers()
  })

  it('should render with child', () => {
    jest.useFakeTimers()
    const props1 = {
      value: 'a',
      handleOnUpdate: jest.fn(),
      label: 'Opt 1',
      radioType: 'tabs',
    }
    const { getByText, getByLabelText } = render(<Radio {...props1}>CHILD TEXT</Radio>)
    const radio = getByLabelText(/CHILD TEXT/i)
    fireEvent.click(radio, { target: { value: 'b' } })
    act(() => jest.runAllTimers())
    expect(getByText('CHILD TEXT')).toBeInTheDocument()
  })
})
