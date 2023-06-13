import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal, { ModalFooter, ModalHeader, ModalBody } from './index'

describe('Modal Component', () => {
  it('should render Modal when showModal is true', () => {
    const { getByText } = render(
      <Modal>
        <p>Modal Body</p>
      </Modal>
    )
    expect(getByText('Modal Body')).toBeInTheDocument()
  })

  it('should not render Modal when showModal is false', () => {
    const { queryByText } = render(<Modal showModal={false}>Modal Body</Modal>)
    expect(queryByText('Modal Body')).toBeNull()
  })

  it('should render Header when needed', () => {
    const { getByText } = render(
      <Modal>
        <ModalHeader>Modal Header</ModalHeader>
      </Modal>
    )
    expect(getByText('Modal Header')).toBeInTheDocument()
  })

  it('should add custom classes to ModalHeader', () => {
    const { container } = render(
      <Modal>
        <ModalHeader className='test-header-class'>Modal Header</ModalHeader>
      </Modal>
    )
    expect(container.getElementsByClassName('test-header-class')).toHaveLength(1)
  })

  it('should render ModalBody when needed', () => {
    const { getByText } = render(
      <Modal>
        <ModalBody>Modal Body</ModalBody>
      </Modal>
    )
    expect(getByText('Modal Body')).toBeInTheDocument()
  })

  it('should add the custom classes to ModalBody', () => {
    const { container } = render(
      <Modal>
        <ModalBody className='test-body-class'>Modal Body</ModalBody>
      </Modal>
    )
    expect(container.getElementsByClassName('test-body-class')).toHaveLength(1)
  })

  it('should render ModalFooter when needed', () => {
    const { getByText } = render(
      <Modal>
        <ModalFooter>Modal Footer</ModalFooter>
      </Modal>
    )
    expect(getByText('Modal Footer')).toBeInTheDocument()
  })

  it('should add custom classes to ModalFooter', () => {
    const { container } = render(
      <Modal>
        <ModalFooter className='test-footer-class'>Modal Header</ModalFooter>
      </Modal>
    )
    expect(container.getElementsByClassName('test-footer-class')).toHaveLength(1)
  })

  it('should close the Modal when Escape is pressed', async () => {
    const closeModal = jest.fn()
    const { queryByText, getByRole } = render(<Modal closeModal={closeModal}>Modal Body</Modal>)
    fireEvent.keyDown(queryByText('Modal Body'), { key: 'Escape' })
    fireEvent.animationEnd(getByRole('dialog').firstChild)
    expect(closeModal).toHaveBeenCalled()
  })

  it('should add custom classes to Modal backdrop', () => {
    const { container } = render(<Modal backdropClassName='test-backdrop-class' />)
    expect(container.getElementsByClassName('test-backdrop-class')).toHaveLength(1)
  })

  it('should add custom classes to Modal', () => {
    const { container } = render(<Modal className='test-modal-class' />)
    expect(container.getElementsByClassName('test-modal-class')).toHaveLength(1)
  })

  it('should add custom classes to the Close Button', () => {
    const { container } = render(<Modal showCloseBtn={true} closeBtnClassName='test-close-class' />)
    expect(container.getElementsByClassName('test-close-class')).toHaveLength(1)
  })

  it('should call onOutsideClick when clicked on the backdrop', () => {
    const handleOutsideClick = jest.fn()
    const { getByRole } = render(<Modal onOutsideClick={() => handleOutsideClick()}>Modal Body</Modal>)
    userEvent.click(getByRole('dialog'))
    expect(handleOutsideClick).toHaveBeenCalled()
  })

  it('should not call onOutsideClick when clicked inside the Modal', () => {
    const handleOutsideClick = jest.fn()
    const { getByRole } = render(<Modal onOutsideClick={() => handleOutsideClick()}>Modal Body</Modal>)
    userEvent.click(getByRole('dialog').firstChild)
    expect(handleOutsideClick).not.toHaveBeenCalled()
  })

  it('should not call onOutsideClick when it is not passed', () => {
    const { getByRole } = render(<Modal>Modal Body</Modal>)
    userEvent.click(getByRole('dialog'))
    expect(getByRole('dialog').firstChild).toBeInTheDocument()
  })

  it('should move focus to first focusable element if Tab is pressed when the last focusable element is in focus', () => {
    const { getByText, getByRole } = render(
      <Modal showCloseBtn={true}>
        <button>Test Button 1 </button>
      </Modal>
    )
    userEvent.tab()
    userEvent.tab()
    fireEvent.keyDown(getByRole('dialog'), {
      key: 'Tab',
      code: 'Tab',
      keyCode: 9,
      charCode: 9,
    })
    expect(getByText('\u2715').parentElement).toHaveFocus()
  })

  it('should move focus to last focusable element if Shift + Tab is pressed when the first focusable element is in focus', () => {
    const { getByText, getByRole } = render(
      <Modal showCloseBtn={false}>
        <button>Test Button 1</button>
      </Modal>
    )
    userEvent.tab()
    fireEvent.keyDown(getByRole('dialog'), {
      key: 'Tab',
      code: 'Tab',
      keyCode: 9,
      charCode: 9,
      shiftKey: true,
    })
    expect(getByText('Test Button 1')).toHaveFocus()
  })

  it('should not do anything when a key other than Escape and Tab is pressed', () => {
    const { getByRole } = render(
      <Modal showCloseBtn={false}>
        <button>Test Button 1</button>
      </Modal>
    )
    fireEvent.keyDown(getByRole('dialog'), {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13,
      shiftKey: true,
    })
    expect(document.body).toHaveFocus()
  })

  it('should append the modal--close class to the modal before unmounting', async () => {
    const { rerender, queryByRole } = render(<Modal />)
    rerender(<Modal showModal={false} />)
    expect(queryByRole('dialog').firstChild).toHaveClass('modal--close')
    fireEvent.animationEnd(queryByRole('dialog').firstChild)
    await waitFor(() => expect(queryByRole('dialog')).not.toBeInTheDocument())
  })
})
