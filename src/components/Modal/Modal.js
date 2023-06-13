import React, { useEffect, useRef, useState } from 'react'
import Button from '../Button'
import './Modal.scss'

/**
 * Provides a Modal component.
 *
 * @component
 * @example
 * const [showModal, setShowModal] = useState(false)
 * return (
 *    <Modal showModal={showModal} closeModal={() => {setShowModal(false)}}>
 *      <ModalHeader>
 *        <h3>Modal Header goes here</h3>
 *      <ModalHeader/>
 *      <ModalBody>
 *        <p>All the main content goes here</p>
 *      </ModalBody>
 *      <ModalFooter>
 *        <button onclick={() => {setShowModal(false)}}>close</button
 *      <Modalfooter/>
 *    </Modal>
 * )
 *
 * @property {Boolean} showModal Decides if the Modal is shown or hidden
 * @property {Function} closeModal Function to close the Modal
 * @property {Function} onOutsideClick Function called when clicked outside the modal.
 * @property {Boolean} showcloseBtn Decides if the Close button should be shown
 * @property {String} className custom class names for the modal
 * @property {String} closeBtnClassName custom class names for the close button
 * @property {String} backdropClassName custom class names for the modal backdrop / background overlay
 */

const Modal = ({
  showModal = true,
  closeModal,
  className,
  closeBtnClassName,
  backdropClassName,
  showCloseBtn,
  children,
  reference,
  onOutsideClick,
}) => {
  const modal = useRef()
  const [shouldRender, setRender] = useState(showModal)

  const handleTabKeyPress = (e) => {
    const focusableModalElements = modal.current.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    )
    const firstElement = focusableModalElements[0]
    const lastElement = focusableModalElements[focusableModalElements.length - 1]

    if (!e.shiftKey && document.activeElement === lastElement) {
      firstElement.focus()
      e.preventDefault()
    }
    if (e.shiftKey && document.activeElement === firstElement) {
      lastElement.focus()
      e.preventDefault()
    }
  }

  const onAnimationEnd = () => {
    !showModal && setRender(false)
  }

  const handleClick = (e) => {
    const modalElement = modal.current
    if (onOutsideClick && onOutsideClick instanceof Function) {
      if (modalElement && !modalElement.contains(e.target)) {
        onOutsideClick(e)
      }
    }
  }

  useEffect(() => {
    if (showModal) {
      setRender(true)
      document.body.style.overflow = 'hidden'
      const handleKeydown = (e) => {
        if (e.key === 'Escape') {
          closeModal()
        } else if (e.key === 'Tab') {
          handleTabKeyPress(e)
        }
      }

      document.addEventListener('keydown', handleKeydown)
      return () => {
        document.body.style.overflow = 'auto'
        document.removeEventListener('keydown', handleKeydown)
      }
    }
  }, [closeModal, showModal])

  return (
    shouldRender && (
      <div
        className={'modal-backdrop ' + (backdropClassName ? backdropClassName : '')}
        role='dialog'
        aria-modal='true'
        ref={reference}
        onClick={handleClick}
      >
        <div
          className={'modal ' + (className ? className : '') + (showModal ? ' modal--open' : ' modal--close')}
          ref={modal}
          onAnimationEnd={onAnimationEnd}
        >
          {showCloseBtn && (
            <Button
              type='button'
              handleOnClick={closeModal}
              classes={'modal__close-btn button-link ' + (closeBtnClassName ? closeBtnClassName : '')}
            >
              &#x2715;
            </Button>
          )}
          {children}
        </div>
      </div>
    )
  )
}

export default Modal
