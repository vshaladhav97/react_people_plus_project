import React from 'react'
import Switch from './Switch'
import { render } from '@testing-library/react'

describe('Switch component', () => {
  it('should render switch component', () => {
    const { getByText } = render(<Switch id='test'>Switch</Switch>)
    expect(getByText('Switch')).toBeInTheDocument()
  })

  it('should render switch when id prop not passed', () => {
    const { getByText } = render(<Switch>Switch</Switch>)
    expect(getByText('Switch')).toBeInTheDocument()
  })

  it('should render children', () => {
    const props = {
      id: 'test 1',
      onChange: jest.fn(),
    }
    const { getByText } = render(<Switch {...props}>Switch</Switch>)
    expect(getByText('Switch')).toBeInTheDocument()
  })

  it('should disable switch slider if it contains disabled prop', () => {
    const { getByRole, container } = render(<Switch id='test1' disabled={true} />)
    getByRole('checkbox').click()
    expect(container.getElementsByClassName('toggle-switch-disabled').length).toBe(2)
  })

  it('should toggle when onChange value changes', () => {
    const onChange = jest.fn()
    const { getByRole } = render(<Switch id='test3' onChange={onChange} />)
    getByRole('checkbox').click()
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
