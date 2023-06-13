import React from 'react'
import Chip from './Chip'
import { render } from '@testing-library/react'

describe('Chip component', () => {
  it('should render', () => {
    const { getByText } = render(<Chip>Basic</Chip>)
    expect(getByText('Basic')).toBeInTheDocument()
  })

  it('should show the delete button when onDelete prop is passed', () => {
    const { getByRole } = render(<Chip onDelete={jest.fn()}>Basic</Chip>)
    expect(getByRole('button')).toBeInTheDocument()
  })

  it('should add custom classes to the component', () => {
    const { getByText } = render(
      <Chip onDelete={jest.fn()} className={{ chip: 'custom-class', content: 'custom-class', delBtn: 'custom-class' }}>
        Basic
      </Chip>
    )
    expect(getByText('Basic')).toHaveClass('custom-class')
  })
})
