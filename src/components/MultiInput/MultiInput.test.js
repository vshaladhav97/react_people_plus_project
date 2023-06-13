import React from 'react'
import MultiInput from './index'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
describe('MultiInput', () => {
  const props = {
    name: 'otp',
    handleOnChange: () => {},
    message: { type: 'error', value: 'Some msg' },
  }
  it('should render', () => {
    const { container } = render(<MultiInput {...props} />)
    expect(container.firstChild).toHaveClass('multi-input')
  })
  it('should tab', () => {
    const { container } = render(<MultiInput {...props} />)
    const firstMI1 = container.querySelector('.codeBox0')
    const firstMI2 = container.querySelector('.codeBox1')
    fireEvent.click(firstMI1)
    fireEvent.keyUp(firstMI1, {
      keyCode: 9,
      charCode: 9,
      which: 9,
    })
    userEvent.tab()
    expect(document.activeElement).toBe(firstMI2)
  })
  it('should tab on input add', () => {
    const { container } = render(<MultiInput {...props} />)
    const firstMI1 = container.querySelector('.codeBox0')
    const firstMI2 = container.querySelector('.codeBox1')
    fireEvent.click(firstMI1)
    fireEvent.change(firstMI1, {
      target: {
        value: 4,
      },
    })
    fireEvent.keyUp(firstMI1, {
      keyCode: 39,
    })
    expect(firstMI2).toHaveFocus()
  })
  it('should tab on number add', () => {
    const { container } = render(<MultiInput {...props} />)
    const firstMI1 = container.querySelector('.codeBox0')
    const firstMI2 = container.querySelector('.codeBox1')
    fireEvent.click(firstMI1)
    fireEvent.change(firstMI1, {
      target: {
        value: 4,
      },
    })
    fireEvent.keyUp(firstMI1, {
      keyCode: 52,
    })
    expect(firstMI2).toHaveFocus()
  })
  it('should do nothing on e click', () => {
    const { container } = render(<MultiInput {...props} />)
    const firstMI1 = container.querySelector('.codeBox0')
    fireEvent.click(firstMI1)
    fireEvent.change(firstMI1, {
      target: {
        value: 4,
      },
    })
    fireEvent.keyDown(firstMI1, {
      keyCode: 69,
    })
    expect(firstMI1).toHaveFocus()
  })
  it('should paste only 6 char', async () => {
    const { container } = render(<MultiInput {...props} />)
    const firstMI1 = container.querySelector('.codeBox0')
    const clipboardEvent = new Event('paste', {
      bubbles: true,
      cancelable: true,
      composed: true,
    })
    // set `clipboardData` and `getData` properties. Set your mocked properties here
    clipboardEvent['clipboardData'] = {
      getData: () => '1234567',
    }
    // dispatch your event to trigger your event handlers
    firstMI1.dispatchEvent(clipboardEvent)
    const firstMI2 = container.querySelector('.codeBox5')
    await waitFor(() => expect(firstMI2.value).toEqual('6'))
  })
  it('should paste all numbers', async () => {
    const { container } = render(<MultiInput {...props} />)
    const firstMI1 = container.querySelector('.codeBox0')
    const clipboardEvent = new Event('paste', {
      bubbles: true,
      cancelable: true,
      composed: true,
    })
    // set `clipboardData` and `getData` properties. Set your mocked properties here
    clipboardEvent['clipboardData'] = {
      getData: () => '12345',
    }
    // dispatch your event to trigger your event handlers
    firstMI1.dispatchEvent(clipboardEvent)
    const firstMI2 = container.querySelector('.codeBox4')
    await waitFor(() => expect(firstMI2.value).toEqual('5'))
  })
  it('should paste only 3 char', async () => {
    const { container } = render(<MultiInput {...props} />)
    const firstMI1 = container.querySelector('.codeBox3')
    const clipboardEvent = new Event('paste', {
      bubbles: true,
      cancelable: true,
      composed: true,
    })
    // set `clipboardData` and `getData` properties. Set your mocked properties here
    clipboardEvent['clipboardData'] = {
      getData: () => '1234567',
    }
    // dispatch your event to trigger your event handlers
    firstMI1.dispatchEvent(clipboardEvent)
    const firstMI2 = container.querySelector('.codeBox5')
    await waitFor(() => expect(firstMI2.value).toEqual('3'))
  })
  it('should not paste numbers', async () => {
    const { container } = render(<MultiInput {...props} />)
    const firstMI1 = container.querySelector('.codeBox0')
    const clipboardEvent = new Event('paste', {
      bubbles: true,
      cancelable: true,
      composed: true,
    })
    // set `clipboardData` and `getData` properties. Set your mocked properties here
    clipboardEvent['clipboardData'] = {
      getData: () => '12345',
    }
    // dispatch your event to trigger your event handlers
    await waitFor(() => firstMI1.dispatchEvent(clipboardEvent))
    clipboardEvent['clipboardData'] = {
      getData: () => '12345',
    }
    await waitFor(() => firstMI1.dispatchEvent(clipboardEvent))
    const firstMI2 = container.querySelector('.codeBox4')
    await waitFor(() => expect(firstMI1.value).toEqual('1'))
  })
  it('should tab on number added from number pad', () => {
    const { container } = render(<MultiInput {...props} />)
    const firstMI1 = container.querySelector('.codeBox0')
    const firstMI2 = container.querySelector('.codeBox1')
    fireEvent.click(firstMI1)
    fireEvent.change(firstMI1, {
      target: {
        value: 9,
      },
    })
    fireEvent.keyUp(firstMI1, {
      keyCode: 105,
    })
    expect(firstMI2).toHaveFocus()
  })
  it('should go back on backspace', () => {
    const { container } = render(<MultiInput {...props} />)
    const firstMI1 = container.querySelector('.codeBox1')
    const firstMI2 = container.querySelector('.codeBox0')
    fireEvent.click(firstMI1)
    fireEvent.change(firstMI1, {
      target: {
        value: 4,
      },
    })
    fireEvent.keyUp(firstMI1, {
      keyCode: 8,
    })
    expect(firstMI2).toHaveFocus()
  })
  it('should go back on left click', () => {
    const { container } = render(<MultiInput {...props} />)
    const firstMI1 = container.querySelector('.codeBox1')
    const firstMI2 = container.querySelector('.codeBox0')
    fireEvent.click(firstMI1)
    fireEvent.change(firstMI1, {
      target: {
        value: 4,
      },
    })
    fireEvent.keyUp(firstMI1, {
      keyCode: 37,
    })
    expect(firstMI2).toHaveFocus()
  })
  it('should maintain focus on alphabet click', () => {
    const { container } = render(<MultiInput {...props} />)
    const firstMI1 = container.querySelector('.codeBox0')
    fireEvent.click(firstMI1)
    fireEvent.change(firstMI1, {
      target: {
        value: 4,
      },
    })
    fireEvent.keyDown(firstMI1, {
      keyCode: 77,
    })
    expect(firstMI1).toHaveFocus()
  })
  it('should maintain focus on special char click', () => {
    const { container } = render(<MultiInput {...props} />)
    const firstMI1 = container.querySelector('.codeBox0')
    fireEvent.click(firstMI1)
    fireEvent.change(firstMI1, {
      target: {
        value: 4,
      },
    })
    fireEvent.keyDown(firstMI1, {
      keyCode: 221,
    })
    expect(firstMI1).toHaveFocus()
  })
  it('should maintain focus on left click', () => {
    const { container } = render(<MultiInput {...props} />)
    const firstMI1 = container.querySelector('.codeBox0')
    fireEvent.click(firstMI1)
    fireEvent.change(firstMI1, {
      target: {
        value: 4,
      },
    })
    fireEvent.keyDown(firstMI1, {
      keyCode: 37,
    })
    expect(firstMI1).toHaveFocus()
  })
  it('should maintain focus on right click', () => {
    const { container } = render(<MultiInput {...props} />)
    const firstMI1 = container.querySelector('.codeBox4')
    const firstMI2 = container.querySelector('.codeBox5')
    fireEvent.click(firstMI1)
    fireEvent.change(firstMI1, {
      target: {
        value: 4,
      },
    })
    fireEvent.keyUp(firstMI1, {
      keyCode: 52,
    })
    fireEvent.keyDown(firstMI2, {
      keyCode: 39,
    })
    expect(firstMI2).toHaveFocus()
  })
  it('should maintain focus on right click', () => {
    const { container } = render(<MultiInput {...props} />)
    const firstMI1 = container.querySelector('.codeBox4')
    const firstMI2 = container.querySelector('.codeBox5')
    fireEvent.click(firstMI2)
    fireEvent.change(firstMI2, {
      target: {
        value: 4,
      },
    })
    fireEvent.keyUp(firstMI2, {
      keyCode: 37,
    })
    fireEvent.keyDown(firstMI2, {
      keyCode: 37,
    })
    expect(firstMI1).toHaveFocus()
  })
  it('should trim to single digit', () => {
    const { container } = render(<MultiInput {...props} />)
    const firstMI0 = container.querySelector('.codeBox0')
    fireEvent.click(firstMI0)
    fireEvent.input(firstMI0, {
      target: {
        value: 44,
      },
    })
    expect(firstMI0.value).toEqual('4')
  })
  it('should keep to single digit', () => {
    const { container } = render(<MultiInput {...props} />)
    const firstMI0 = container.querySelector('.codeBox0')
    fireEvent.click(firstMI0)
    fireEvent.input(firstMI0, {
      target: {
        value: 4,
      },
    })
  })
})
