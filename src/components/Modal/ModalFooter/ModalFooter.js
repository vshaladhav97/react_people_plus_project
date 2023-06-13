import React from 'react'
import '../Modal.scss'

const ModalFooter = (props) => {
  return <div className={'modal__footer ' + (props.className ? props.className : '')}>{props.children}</div>
}

export default ModalFooter
