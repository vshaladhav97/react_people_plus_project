import React from 'react'
import Input from './Input'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Input Component', () => {
  it('should render the Input component', () => {
    const handleOnChange = jest.fn()
    const { getByText } = render(
      <Input value={''} handleOnChange={handleOnChange} label={'Label Text'} placeholder='Placeholder Text' message='Message Text' />
    )
    expect(getByText('Label Text')).toBeInTheDocument()
  })

  it('should render the Message when message prop is not empty', () => {
    const handleOnChange = jest.fn()
    const { getByText } = render(
      <Input value={''} message={{ value: 'Message text' }} handleOnChange={handleOnChange} label={'Label Text'} labelAlign='left' />
    )
    expect(getByText('Message text')).toBeInTheDocument()
  })

  it('should render the Message accordingly when labelAlign is set to top ', () => {
    const handleOnChange = jest.fn()
    const { getByText } = render(
      <Input value={''} message={{ value: 'Message text' }} handleOnChange={handleOnChange} label={'Label Text'} labelAlign='top' />
    )
    expect(getByText('Message text')).toBeInTheDocument()
  })

  it('should render textarea when necessary', () => {
    const handleOnChange = jest.fn()
    const { getByLabelText } = render(
      <Input value={''} handleOnChange={handleOnChange} label={'Label Text'} labelAlign='left' textarea id='test-textarea-id' />
    )
    expect(getByLabelText('Label Text')).toBeInTheDocument()
  })

  it('should add class active on text enter and remove it when input is empty', () => {
    const handleOnChange = jest.fn()
    const { container } = render(
      <Input value={'hello'} handleOnChange={handleOnChange} labelAlign='float' label={'test-label'} message='Message Text' />
    )
    userEvent.type(container.querySelector('input'), 'test')
    expect(container.querySelector('label')).toHaveClass('active')
    userEvent.clear(container.querySelector('input'))
    expect(container.querySelector('label')).not.toHaveClass('active')
  })
})
