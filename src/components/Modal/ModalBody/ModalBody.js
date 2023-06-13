import React from 'react'
import '../Modal.scss'

const ModalBody = (props) => {
  return <div className={'modal__body ' + (props.className ? props.className : '')}>{props.children}</div>
}

export default ModalBody
