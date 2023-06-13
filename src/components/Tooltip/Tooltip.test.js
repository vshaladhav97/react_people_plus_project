import React from 'react'
import Tooltip from './index'
import { render, cleanup, fireEvent } from '@testing-library/react'

const text = 'tooltip data'
const children = 'Hover over me!'

afterEach(cleanup)

describe('Tooltip', () => {
  it('renders the children properly', () => {
    const App = () => <Tooltip content={text}>{children}</Tooltip>
    const { getByText } = render(<App />)
    expect(getByText(children).innerHTML).toBe(children)
  })
  it('renders tooltip on enter and hides on leave', () => {
    const { getByText } = render(<Tooltip content={text}>{children}</Tooltip>)
    fireEvent.mouseEnter(getByText(children))
    expect(getByText(text).innerHTML).toBe(text)
  })
})
